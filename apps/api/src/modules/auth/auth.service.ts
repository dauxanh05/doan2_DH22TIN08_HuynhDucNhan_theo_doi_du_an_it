import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {}

  /**
   * Register a new user
   * - Check if email already exists
   * - Hash password with bcrypt
   * - Create user in database
   * - Return user info (without password)
   */
  async register(dto: RegisterDto) {
    // Check if email is already taken
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email da duoc su dung');
    }

    // Hash password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // Send verification email (don't block registration if email fails)
    try {
      await this.sendVerificationEmail(user.email);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${user.email}`, error.message);
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Login with email and password
   * - Find user by email
   * - Compare password with bcrypt
   * - Generate access token + refresh token
   * - Return tokens and user info
   */
  async login(email: string, password: string) {
    // Find user WITH password (needed for bcrypt.compare)
    const user = await this.usersService.findByEmailWithPassword(email);

    // If user not found or password is null (Google OAuth user)
    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
    }

    // Compare password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Return tokens + user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  /**
   * Hash a token using SHA-256 (fast, suitable for high-entropy tokens)
   * Unlike bcrypt (slow, for passwords), refresh tokens are 128 hex chars
   * with enough entropy that SHA-256 is secure and allows direct DB lookup.
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate access token (JWT) + refresh token (random string)
   * - Access token: JWT signed with secret, expires in 15m
   * - Refresh token: random string, SHA-256 hashed and saved to DB, expires in 7 days
   */
  private async generateTokens(userId: string, email: string) {
    // Build JWT payload
    const payload: JwtPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    // Sign access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    // Generate random refresh token (128 hex chars = 512 bits entropy)
    const refreshToken = randomBytes(64).toString('hex');

    // Hash with SHA-256 for direct DB lookup (O(1) instead of O(n) bcrypt compare)
    const hashedRefreshToken = this.hashToken(refreshToken);

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save hashed refresh token to database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  /**
   * Refresh tokens using Refresh Token Rotation
   * - Hash raw token with SHA-256 and query DB directly (O(1) lookup)
   * - Revoke old token, generate new pair
   * - If no match found: possible token theft
   */
  async refresh(rawToken: string) {
    // Hash the raw token to look up directly in DB (O(1) instead of O(n))
    const hashedToken = this.hashToken(rawToken);

    // Find the exact token in DB
    const matchedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    // Validate: token must exist, not be revoked, and not be expired
    if (!matchedToken || matchedToken.revoked || matchedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    // Revoke ALL tokens of this user (security: invalidate old sessions)
    await this.prisma.refreshToken.updateMany({
      where: { userId: matchedToken.userId, revoked: false },
      data: { revoked: true },
    });

    // Generate new token pair
    const tokens = await this.generateTokens(
      matchedToken.userId,
      matchedToken.user.email,
    );

    // Return new access token + user info (without password)
    const { password, ...userWithoutPassword } = matchedToken.user;
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  /**
   * Logout - revoke all refresh tokens for a user
   * This invalidates all sessions across all devices
   */
  async logout(userId: string) {
    // Revoke all active refresh tokens of this user
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    return { message: 'Dang xuat thanh cong' };
  }

  /**
   * Send verification email
   * - Create JWT token with email + type 'verify-email', expires in 24h
   * - Send email with verification link to frontend
   */
  private async sendVerificationEmail(email: string) {
    const token = this.jwtService.sign(
      { email, type: 'verify-email' },
      { expiresIn: '24h' },
    );

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/verify-email/${token}`;

    await this.emailService.sendMail(
      email,
      'Xac nhan email - DevTeamOS',
      `
        <h2>Chao mung ban den voi DevTeamOS!</h2>
        <p>Vui long click vao link ben duoi de xac nhan email cua ban:</p>
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">
          Xac nhan email
        </a>
        <p>Link nay se het han sau 24 gio.</p>
        <p>Neu ban khong dang ky tai khoan, vui long bo qua email nay.</p>
      `,
    );
  }

  /**
   * Verify email using JWT token
   * - Decode and verify the JWT token
   * - Check token type is 'verify-email'
   * - Find user by email and set emailVerified = true
   */
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'verify-email') {
        throw new BadRequestException('Token khong hop le');
      }

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('User khong ton tai');
      }

      // Update emailVerified to true
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });

      return { message: 'Email da duoc xac nhan' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Token khong hop le hoac da het han');
    }
  }

  /**
   * Forgot password - send reset password email
   * - Always return success message (security: don't reveal if email exists)
   * - If user exists, create JWT reset token and send email
   */
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // If user exists, send reset email
    if (user) {
      const token = this.jwtService.sign(
        { email, type: 'reset-password' },
        { expiresIn: '1h' },
      );

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      const resetUrl = `${frontendUrl}/reset-password/${token}`;

      try {
        await this.emailService.sendMail(
          email,
          'Dat lai mat khau - DevTeamOS',
          `
            <h2>Dat lai mat khau</h2>
            <p>Ban da yeu cau dat lai mat khau. Click vao link ben duoi:</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">
              Dat lai mat khau
            </a>
            <p>Link nay se het han sau 1 gio.</p>
            <p>Neu ban khong yeu cau dat lai mat khau, vui long bo qua email nay.</p>
          `,
        );
      } catch (error) {
        this.logger.error(`Failed to send reset email to ${email}`, error.message);
      }
    }

    // Always return success (don't reveal if email exists)
    return { message: 'Neu email ton tai, ban se nhan duoc email huong dan' };
  }

  /**
   * Google OAuth login
   * - Find user by email
   * - If exists with LOCAL provider: merge account (keep LOCAL provider, update providerId)
   * - If exists with GOOGLE provider: just generate tokens
   * - If not exists: create new user
   * - Return tokens + user info
   */
  async googleLogin(googleUser: {
    email: string;
    name: string;
    avatar?: string;
    providerId: string;
  }) {
    let user = await this.usersService.findByEmail(googleUser.email);

    if (user) {
      // User exists with LOCAL provider -> merge account
      if (user.provider === 'LOCAL' && !user.providerId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            // Keep provider as LOCAL, just save the providerId to link accounts
            providerId: googleUser.providerId,
            emailVerified: true,
          },
        });
      }
      // If provider is GOOGLE, or LOCAL and already linked, continue to generate tokens
    } else {
      // New user -> create with GOOGLE provider
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
          provider: 'GOOGLE',
          providerId: googleUser.providerId,
          emailVerified: true,
          password: null,
        },
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // Return tokens + user info (without password)
    const { password: _pw, ...userWithoutPassword } = user as any;
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  /**
   * Reset password using JWT token
   * - Verify token and check type is 'reset-password'
   * - Hash new password and update in DB
   * - Revoke all refresh tokens (force re-login)
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'reset-password') {
        throw new BadRequestException('Token khong hop le');
      }

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestException('User khong ton tai');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in DB
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      // Revoke all refresh tokens (force user to login again)
      await this.prisma.refreshToken.updateMany({
        where: { userId: user.id, revoked: false },
        data: { revoked: true },
      });

      return { message: 'Mat khau da duoc dat lai' };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Token khong hop le hoac da het han');
    }
  }
}
