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

  private async generateTokens(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
      type: 'access',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    const refreshToken = randomBytes(64).toString('hex');

    const hashedRefreshToken = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: hashedRefreshToken,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async refresh(rawToken: string) {
    const hashedToken = this.hashToken(rawToken);

    const matchedToken = await this.prisma.refreshToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!matchedToken || matchedToken.revoked || matchedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    await this.prisma.refreshToken.updateMany({
      where: { userId: matchedToken.userId, revoked: false },
      data: { revoked: true },
    });

    const tokens = await this.generateTokens(
      matchedToken.userId,
      matchedToken.user.email,
    );

    const { password: _pw, ...userWithoutPassword } = matchedToken.user;
    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  async logout(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

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
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      const token = this.jwtService.sign(
        { email, type: 'reset-password' },
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

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      ...tokens,
      user,
    };
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

    if (payload.type !== 'reset-password') {
      throw new BadRequestException('Token khong hop le');
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new BadRequestException('User khong ton tai');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId: user.id, revoked: false },
      data: { revoked: true },
    });

    return { message: 'Mat khau da duoc dat lai' };
  }
}
