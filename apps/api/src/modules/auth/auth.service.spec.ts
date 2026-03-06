import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

describe('AuthService - Security Regression Tests', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let usersService: jest.Mocked<UsersService>;
  let emailService: jest.Mocked<EmailService>;
  let cacheManager: jest.Mocked<Cache>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    provider: 'LOCAL' as const,
    providerId: null,
    avatar: null,
    theme: 'SYSTEM' as const,
    emailVerified: false,
    resetNonce: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRefreshToken = {
    id: 'token-123',
    userId: 'user-123',
    token: 'hashed-token-value',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    revoked: false,
    device: null,
    ip: null,
    user: mockUser,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          JWT_SECRET: 'test-secret',
          JWT_EXPIRES_IN: '15m',
          FRONTEND_URL: 'http://localhost:3000',
        };
        return config[key];
      }),
    };

    const mockUsersService = {
      findByEmail: jest.fn(),
      findByEmailWithPassword: jest.fn(),
    };

    const mockEmailService = {
      sendMail: jest.fn(),
    };

    const mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    usersService = module.get(UsersService);
    emailService = module.get(EmailService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Refresh Token Rotation (Security Behavior #1)', () => {
    it('should invalidate old refresh token and return new token on successful refresh', async () => {
      // Arrange
      const rawToken = 'raw-refresh-token-value';
      const newRawToken = 'new-raw-refresh-token';

      const transactionCallback = jest.fn(async (tx) => {
        return {
          accessToken: 'new-access-token',
          refreshToken: newRawToken,
          user: { id: mockUser.id, email: mockUser.email, name: mockUser.name },
        };
      });

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const mockTx = {
          refreshToken: {
            findUnique: jest.fn().mockResolvedValue(mockRefreshToken),
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
            deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
            create: jest.fn().mockResolvedValue({
              ...mockRefreshToken,
              token: 'new-hashed-token',
            }),
          },
        };
        return callback(mockTx);
      });

      jwtService.sign.mockReturnValue('new-access-token');

      // Act
      const result = await service.refresh(rawToken);

      // Assert
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.refreshToken).not.toBe(rawToken);

      const txCall = (prismaService.$transaction as jest.Mock).mock.calls[0][0];
      const mockTx = {
        refreshToken: {
          findUnique: jest.fn().mockResolvedValue(mockRefreshToken),
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
          deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
          create: jest.fn().mockResolvedValue(mockRefreshToken),
        },
      };

      await txCall(mockTx);

      expect(mockTx.refreshToken.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { revoked: true },
        }),
      );
      expect(mockTx.refreshToken.create).toHaveBeenCalled();
    });

    it('should reject reuse of old refresh token after rotation', async () => {
      // Arrange
      const oldToken = 'old-revoked-token';

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const mockTx = {
          refreshToken: {
            findUnique: jest.fn().mockResolvedValue({
              ...mockRefreshToken,
              revoked: true,
            }),
          },
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.refresh(oldToken)).rejects.toThrow(UnauthorizedException);
      await expect(service.refresh(oldToken)).rejects.toThrow('Refresh token khong hop le');
    });

    it('should reject expired refresh token', async () => {
      // Arrange
      const expiredToken = 'expired-token';

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const mockTx = {
          refreshToken: {
            findUnique: jest.fn().mockResolvedValue({
              ...mockRefreshToken,
              expiresAt: new Date(Date.now() - 1000),
            }),
          },
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.refresh(expiredToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle race condition - reject if token already revoked during transaction', async () => {
      // Arrange
      const token = 'race-condition-token';

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const mockTx = {
          refreshToken: {
            findUnique: jest.fn().mockResolvedValue(mockRefreshToken),
            updateMany: jest.fn().mockResolvedValue({ count: 0 }),
          },
        };
        return callback(mockTx);
      });

      // Act & Assert
      await expect(service.refresh(token)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Password Reset Token Single-Use via resetNonce (Security Behavior #2)', () => {
    it('should clear resetNonce after successful password reset', async () => {
      // Arrange
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewSecurePassword123!';
      const resetNonce = 'unique-nonce-value';

      jwtService.verify.mockReturnValue({
        email: mockUser.email,
        type: 'reset-password',
        nonce: resetNonce,
      });

      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        resetNonce,
      });

      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        resetNonce: null,
      });

      prismaService.refreshToken.updateMany.mockResolvedValue({ count: 2 });
      prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 0 });

      // Act
      const result = await service.resetPassword(resetToken, newPassword);

      // Assert
      expect(result).toEqual({ message: 'Mat khau da duoc dat lai' });
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          password: expect.any(String),
          resetNonce: null,
        },
      });
    });

    it('should reject password reset with reused token (nonce mismatch)', async () => {
      // Arrange
      const resetToken = 'reused-reset-token';
      const newPassword = 'NewPassword123!';
      const oldNonce = 'old-nonce-value';
      const currentNonce = 'new-nonce-value';

      jwtService.verify.mockReturnValue({
        email: mockUser.email,
        type: 'reset-password',
        nonce: oldNonce,
      });

      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        resetNonce: currentNonce,
      });

      // Act & Assert
      await expect(service.resetPassword(resetToken, newPassword)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(resetToken, newPassword)).rejects.toThrow(
        'Token khong hop le',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should reject password reset when resetNonce is null (already used)', async () => {
      // Arrange
      const resetToken = 'already-used-token';
      const newPassword = 'NewPassword123!';
      const nonce = 'some-nonce';

      jwtService.verify.mockReturnValue({
        email: mockUser.email,
        type: 'reset-password',
        nonce,
      });

      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        resetNonce: null,
      });

      // Act & Assert
      await expect(service.resetPassword(resetToken, newPassword)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should reject password reset with invalid token type', async () => {
      // Arrange
      const invalidToken = 'wrong-type-token';
      const newPassword = 'NewPassword123!';

      jwtService.verify.mockReturnValue({
        email: mockUser.email,
        type: 'verify-email',
        nonce: 'some-nonce',
      });

      // Act & Assert
      await expect(service.resetPassword(invalidToken, newPassword)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.resetPassword(invalidToken, newPassword)).rejects.toThrow(
        'Token khong hop le',
      );
    });

    it('should revoke all refresh tokens after password reset', async () => {
      // Arrange
      const resetToken = 'valid-reset-token';
      const newPassword = 'NewSecurePassword123!';
      const resetNonce = 'unique-nonce-value';

      jwtService.verify.mockReturnValue({
        email: mockUser.email,
        type: 'reset-password',
        nonce: resetNonce,
      });

      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        resetNonce,
      });

      prismaService.user.update.mockResolvedValue({
        ...mockUser,
        resetNonce: null,
      });

      prismaService.refreshToken.updateMany.mockResolvedValue({ count: 3 });
      prismaService.refreshToken.deleteMany.mockResolvedValue({ count: 0 });

      // Act
      await service.resetPassword(resetToken, newPassword);

      // Assert
      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id, revoked: false },
        data: { revoked: true },
      });
    });
  });

  describe('Google One-Time Auth Code Exchange (Security Behavior #3)', () => {
    it('should successfully exchange valid Google auth code once', async () => {
      // Arrange
      const authCode = 'valid-google-auth-code';
      const accessToken = 'google-access-token';

      cacheManager.get.mockResolvedValue(accessToken);
      cacheManager.del.mockResolvedValue(undefined);

      // Act
      const result = await service.exchangeGoogleAuthCode(authCode);

      // Assert
      expect(result).toEqual({ accessToken });
      expect(cacheManager.get).toHaveBeenCalledWith(`google-auth-code:${authCode}`);
      expect(cacheManager.del).toHaveBeenCalledWith(`google-auth-code:${authCode}`);
    });

    it('should delete auth code from cache after first exchange', async () => {
      // Arrange
      const authCode = 'one-time-code';
      const accessToken = 'google-access-token';

      cacheManager.get.mockResolvedValue(accessToken);
      cacheManager.del.mockResolvedValue(undefined);

      // Act
      await service.exchangeGoogleAuthCode(authCode);

      // Assert
      expect(cacheManager.del).toHaveBeenCalledWith(`google-auth-code:${authCode}`);
      expect(cacheManager.del).toHaveBeenCalledTimes(1);
    });

    it('should reject second attempt to exchange same Google auth code', async () => {
      // Arrange
      const authCode = 'already-used-code';

      cacheManager.get.mockResolvedValue(null);

      // Act & Assert
      await expect(service.exchangeGoogleAuthCode(authCode)).rejects.toThrow(UnauthorizedException);
      await expect(service.exchangeGoogleAuthCode(authCode)).rejects.toThrow(
        'Ma dang nhap Google khong hop le hoac da het han',
      );
      expect(cacheManager.del).not.toHaveBeenCalled();
    });

    it('should reject expired Google auth code', async () => {
      // Arrange
      const expiredCode = 'expired-google-code';

      cacheManager.get.mockResolvedValue(null);

      // Act & Assert
      await expect(service.exchangeGoogleAuthCode(expiredCode)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should store Google auth code with TTL during login', async () => {
      // Arrange
      const googleUser = {
        email: 'google@example.com',
        name: 'Google User',
        avatar: 'https://example.com/avatar.jpg',
        providerId: 'google-provider-id',
      };

      usersService.findByEmail.mockResolvedValue(null);

      prismaService.user.create.mockResolvedValue({
        ...mockUser,
        email: googleUser.email,
        name: googleUser.name,
        provider: 'GOOGLE',
        providerId: googleUser.providerId,
        emailVerified: true,
      });

      prismaService.refreshToken.create.mockResolvedValue(mockRefreshToken);

      jwtService.sign.mockReturnValue('google-access-token');
      cacheManager.set.mockResolvedValue(undefined);

      // Act
      const result = await service.googleLogin(googleUser);

      // Assert
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('refreshToken');
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining('google-auth-code:'),
        expect.any(String),
        60000,
      );
    });
  });
});
