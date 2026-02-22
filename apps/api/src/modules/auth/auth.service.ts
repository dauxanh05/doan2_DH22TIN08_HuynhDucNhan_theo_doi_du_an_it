import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
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
    // Find user by email
    const user = await this.usersService.findByEmail(email);

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
   * Generate access token (JWT) + refresh token (random string)
   * - Access token: JWT signed with secret, expires in 15m
   * - Refresh token: random string, hashed and saved to DB, expires in 7 days
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

    // Generate random refresh token
    const refreshToken = randomBytes(64).toString('hex');

    // Hash refresh token before saving to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

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
   * - Find matching token in DB (bcrypt compare)
   * - Revoke old token, generate new pair
   * - If no match found: possible token theft
   */
  async refresh(rawToken: string) {
    // Find all active (non-revoked, non-expired) refresh tokens in DB
    const activeTokens = await this.prisma.refreshToken.findMany({
      where: {
        revoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    // Compare raw token with each hashed token using bcrypt
    let matchedToken: (typeof activeTokens)[number] | null = null;
    for (const dbToken of activeTokens) {
      const isMatch = await bcrypt.compare(rawToken, dbToken.token);
      if (isMatch) {
        matchedToken = dbToken;
        break;
      }
    }

    // No valid token found - possible token theft
    if (!matchedToken) {
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
}
