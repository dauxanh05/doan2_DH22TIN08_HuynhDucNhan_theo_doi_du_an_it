import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash, randomInt } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const REFRESH_TOKEN_TTL_DAYS = 7;
const GOOGLE_AUTH_CODE_TTL_MS = 60_000;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 phut

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const email = dto.email.toLowerCase().trim();

    // Check email da ton tai chua
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email da duoc su dung');
    }

    // Generate OTP 6 so (CSPRNG)
    const otp = randomInt(100000, 999999).toString();
    const otpHash = createHash('sha256').update(otp).digest('hex');

    // Hash password truoc khi luu vao cache
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Luu pending data + OTP hash vao cache
    const cacheKey = `register-otp:${email}`;
    await this.cacheManager.set(cacheKey, {
      email,
      name: dto.name,
      password: hashedPassword,
      otpHash,
      attemptsLeft: 5,
    }, OTP_TTL_MS);

    // Gui email OTP
    try {
      await this.emailService.sendMail(
        email,
        'Ma xac thuc OTP - DevTeamOS',
        `
          <h2>Chao mung ban den voi DevTeamOS!</h2>
          <p>Ma xac thuc cua ban la:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;background:#f3f4f6;border-radius:8px;margin:16px 0;">
            ${otp}
          </div>
          <p>Ma nay se het han sau 5 phut.</p>
          <p>Neu ban khong dang ky tai khoan, vui long bo qua email nay.</p>
        `,
      );
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}`, error.message);
      throw new BadRequestException('Khong the gui email OTP. Vui long thu lai.');
    }

    return { message: 'Ma OTP da duoc gui den email cua ban' };
  }

  async verifyOtp(email: string, otp: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const cacheKey = `register-otp:${normalizedEmail}`;
    const cached = await this.cacheManager.get<{
      email: string;
      name: string;
      password: string;
      otpHash: string;
      attemptsLeft: number;
    }>(cacheKey);

    if (!cached) {
      throw new BadRequestException('Ma OTP da het han. Vui long dang ky lai.');
    }

    // Check attempts
    if (cached.attemptsLeft <= 0) {
      await this.cacheManager.del(cacheKey);
      throw new BadRequestException('Da vuot qua so lan thu. Vui long dang ky lai.');
    }

    // Compare OTP hash
    const inputHash = createHash('sha256').update(otp).digest('hex');
    if (cached.otpHash !== inputHash) {
      // Giam so lan thu
      cached.attemptsLeft -= 1;
      if (cached.attemptsLeft <= 0) {
        await this.cacheManager.del(cacheKey);
        throw new BadRequestException('Ma OTP khong dung. Da het so lan thu.');
      }
      // Update cache with remaining TTL (re-set with original TTL for simplicity)
      await this.cacheManager.set(cacheKey, cached, OTP_TTL_MS);
      throw new BadRequestException(`Ma OTP khong dung. Con ${cached.attemptsLeft} lan thu.`);
    }

    // Xoa OTP khoi cache
    await this.cacheManager.del(cacheKey);

    // Check email lan nua (phong truong hop race condition)
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException('Email da duoc su dung');
    }

    // Tao user voi emailVerified: true
    const created = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        password: cached.password,
        name: cached.name,
        emailVerified: true,
      },
    });

    // Generate tokens de auto-login
    const tokens = await this.generateTokens(created.id, created.email);

    const { password: _, ...user } = created;
    return {
      ...tokens,
      user,
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findByEmailWithPassword(normalizedEmail);

    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
    }

    // Block unverified users
    if (!user.emailVerified) {
      throw new UnauthorizedException('Vui long xac thuc email truoc khi dang nhap');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const { password: _, ...userWithoutPassword } = user;
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private createResetNonce(): string {
    return randomBytes(32).toString('hex');
  }

  private async createRefreshTokenRecord(userId: string) {
    const refreshToken = randomBytes(64).toString('hex');
    const hashedRefreshToken = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private async cleanupRefreshTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        OR: [{ revoked: true }, { expiresAt: { lt: new Date() } }],
      },
    });
  }

  private async storeGoogleAuthCode(userId: string, email: string, user: Record<string, any>) {
    const code = randomBytes(32).toString('hex');
    const accessToken = this.jwtService.sign(
      {
        sub: userId,
        email,
        type: 'access',
      },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      },
    );

    await this.cacheManager.set(`google-auth-code:${code}`, { accessToken, user }, GOOGLE_AUTH_CODE_TTL_MS);

    return code;
  }

  private async consumeGoogleAuthCode(code: string) {
    const cacheKey = `google-auth-code:${code}`;
    const cached = await this.cacheManager.get<{ accessToken: string; user: Record<string, any> }>(cacheKey);

    if (!cached) {
      throw new UnauthorizedException('Ma dang nhap Google khong hop le hoac da het han');
    }

    await this.cacheManager.del(cacheKey);

    return cached;
  }

  private async generateTokens(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = await this.createRefreshTokenRecord(userId);

    return { accessToken, refreshToken };
  }

  async refresh(rawToken: string) {
    const hashedToken = this.hashToken(rawToken);

    const result = await this.prisma.$transaction(async (tx) => {
      const matchedToken = await tx.refreshToken.findUnique({
        where: { token: hashedToken },
        include: { user: true },
      });

      if (!matchedToken || matchedToken.revoked || matchedToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token khong hop le');
      }

      const revokeResult = await tx.refreshToken.updateMany({
        where: {
          id: matchedToken.id,
          revoked: false,
          expiresAt: { gte: new Date() },
        },
        data: { revoked: true },
      });

      if (revokeResult.count !== 1) {
        throw new UnauthorizedException('Refresh token khong hop le');
      }

      await tx.refreshToken.deleteMany({
        where: {
          userId: matchedToken.userId,
          OR: [{ revoked: true }, { expiresAt: { lt: new Date() } }],
        },
      });

      const newRefreshToken = randomBytes(64).toString('hex');
      const hashedRefreshToken = this.hashToken(newRefreshToken);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

      await tx.refreshToken.create({
        data: {
          userId: matchedToken.userId,
          token: hashedRefreshToken,
          expiresAt,
        },
      });

      const accessToken = this.jwtService.sign(
        {
          sub: matchedToken.userId,
          email: matchedToken.user.email,
          type: 'access',
        },
        {
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
        },
      );

      const { password: _pw, ...userWithoutPassword } = matchedToken.user;

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: userWithoutPassword,
      };
    });

    return result;
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
    await this.cleanupRefreshTokens(userId);

    return { message: 'Dang xuat thanh cong' };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (user) {
      const resetNonce = this.createResetNonce();
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetNonce },
      });

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const token = this.jwtService.sign(
        { email, type: 'reset-password', nonce: resetNonce },
        { secret: `${jwtSecret}_reset`, expiresIn: '1h' },
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

    return { message: 'Neu email ton tai, ban se nhan duoc email huong dan' };
  }

  async googleLogin(googleUser: {
    email: string;
    name: string;
    avatar?: string;
    providerId: string;
  }) {
    const normalizedEmail = googleUser.email.toLowerCase().trim();
    let user = await this.usersService.findByEmail(normalizedEmail);

    if (user) {
      if (user.provider === 'LOCAL' && !user.providerId) {
        const updated = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            providerId: googleUser.providerId,
            emailVerified: true,
          },
        });
        const { password: _pw, ...rest } = updated;
        user = rest;
      }
    } else {
      const created = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          name: googleUser.name,
          avatar: googleUser.avatar,
          provider: 'GOOGLE',
          providerId: googleUser.providerId,
          emailVerified: true,
          password: null,
        },
      });
      const { password: _pw, ...rest } = created;
      user = rest;
    }

    const refreshToken = await this.createRefreshTokenRecord(user.id);
    const code = await this.storeGoogleAuthCode(user.id, user.email, user);

    return {
      code,
      refreshToken,
      user,
    };
  }

  async exchangeGoogleAuthCode(code: string) {
    return this.consumeGoogleAuthCode(code);
  }

  async resetPassword(token: string, newPassword: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: `${jwtSecret}_reset`,
      });
    } catch {
      throw new BadRequestException('Token khong hop le hoac da het han');
    }

    if (payload.type !== 'reset-password' || !payload.nonce) {
      throw new BadRequestException('Token khong hop le');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        resetNonce: true,
      },
    });
    if (!user || !user.resetNonce || user.resetNonce !== payload.nonce) {
      throw new BadRequestException('Token khong hop le');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetNonce: null,
      },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });
    await this.cleanupRefreshTokens(user.id);

    return { message: 'Mat khau da duoc dat lai' };
  }

  /**
   * Verify email via token link (backward compat for old users)
   */
  async verifyEmail(token: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: `${jwtSecret}_verify`,
      });
    } catch {
      throw new BadRequestException('Link xac thuc khong hop le hoac da het han');
    }

    if (payload.type !== 'verify-email' || !payload.email) {
      throw new BadRequestException('Link xac thuc khong hop le');
    }

    const normalizedEmail = (payload.email as string).toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new BadRequestException('Nguoi dung khong ton tai');
    }

    if (user.emailVerified) {
      return { message: 'Email da duoc xac thuc truoc do' };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return { message: 'Email da duoc xac thuc thanh cong' };
  }

  /**
   * Resend verification email for unverified LOCAL users
   */
  async resendVerificationEmail(email: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      // Don't reveal if email exists
      return { message: 'Neu email ton tai va chua xac thuc, ban se nhan duoc email' };
    }

    if (user.emailVerified) {
      return { message: 'Email da duoc xac thuc truoc do' };
    }

    if (user.provider !== 'LOCAL') {
      return { message: 'Tai khoan nay su dung dang nhap Google' };
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const token = this.jwtService.sign(
      { email: normalizedEmail, type: 'verify-email' },
      { secret: `${jwtSecret}_verify`, expiresIn: '24h' },
    );

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verifyUrl = `${frontendUrl}/verify-email/${token}`;

    try {
      await this.emailService.sendMail(
        normalizedEmail,
        'Xac thuc email - DevTeamOS',
        `
          <h2>Xac thuc email cua ban</h2>
          <p>Click vao link ben duoi de xac thuc email:</p>
          <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">
            Xac thuc email
          </a>
          <p>Link nay se het han sau 24 gio.</p>
        `,
      );
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${normalizedEmail}`, error.message);
    }

    return { message: 'Neu email ton tai va chua xac thuc, ban se nhan duoc email' };
  }
}
