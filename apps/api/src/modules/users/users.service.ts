import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

const UPLOADS_URL_PREFIX = '/uploads/';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find user by email (safe - excludes password)
   * Used by: register, verifyEmail, forgotPassword, resetPassword, googleLogin
   */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  /**
   * Find user by email WITH password hash (only for login)
   * WARNING: Only use when you need to verify password with bcrypt.compare()
   */
  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /**
   * Get user profile (exclude password)
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        theme: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Khong tim thay nguoi dung');
    }

    return user;
  }

  /**
   * Update user profile (name, avatar, theme)
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        theme: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    return user;
  }

  /**
   * Change password (only for LOCAL provider users)
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Khong tim thay nguoi dung');
    }

    // Google OAuth users don't have a password
    if (!user.password) {
      throw new BadRequestException('Tai khoan Google khong co mat khau');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mat khau hien tai khong dung');
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Doi mat khau thanh cong' };
  }

  /**
   * Upload avatar file and update user record
   */
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    // Get current user to check for old avatar
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    // Delete old avatar file if exists
    if (user?.avatar?.startsWith(UPLOADS_URL_PREFIX)) {
      const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || './uploads');
      const relativeAvatarPath = user.avatar.slice(UPLOADS_URL_PREFIX.length);
      const oldPath = path.resolve(uploadDir, relativeAvatarPath);

      if (oldPath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new avatar path (relative URL for frontend)
    const avatarPath = `/uploads/avatars/${file.filename}`;
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath },
    });

    return { avatar: avatarPath };
  }
}
