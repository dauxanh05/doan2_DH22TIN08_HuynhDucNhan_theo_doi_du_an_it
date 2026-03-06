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
import { randomBytes, createHash } from 'crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

const REFRESH_TOKEN_TTL_DAYS = 7;
const GOOGLE_AUTH_CODE_TTL_MS = 60_000;

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

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email da duoc su dung');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const created = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    try {
      await this.sendVerificationEmail(created.email);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${created.email}`, error.message);
    }

    const { password, ...user } = created;
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoac mat khau khong dung');
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

  private async storeGoogleAuthCode(userId: string, email: string) {
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

    await this.cacheManager.set(`google-auth-code:${code}`, accessToken, GOOGLE_AUTH_CODE_TTL_MS);

    return code;
  }

  private async consumeGoogleAuthCode(code: string) {
    const cacheKey = `google-auth-code:${code}`;
    const accessToken = await this.cacheManager.get<string>(cacheKey);

    if (!accessToken) {
      throw new UnauthorizedException('Ma dang nhap Google khong hop le hoac da het han');
    }

    await this.cacheManager.del(cacheKey);

    return { accessToken };
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

  private async sendVerificationEmail(email: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const token = this.jwtService.sign(
      { email, type: 'verify-email' },
      { secret: `${jwtSecret}_verify`, expiresIn: '24h' },
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

  async verifyEmail(token: string) {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: `${jwtSecret}_verify`,
      });
    } catch {
      throw new BadRequestException('Token khong hop le hoac da het han');
    }

    if (payload.type !== 'verify-email') {
      throw new BadRequestException('Token khong hop le');
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new BadRequestException('User khong ton tai');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return { message: 'Email da duoc xac nhan' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

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
    let user = await this.usersService.findByEmail(googleUser.email);

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
          email: googleUser.email,
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
    const code = await this.storeGoogleAuthCode(user.id, user.email);

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
}
