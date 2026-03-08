import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async create(userId: string, dto: CreateWorkspaceDto) {
    // Check slug unique
    const existing = await this.prisma.workspace.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Workspace slug already exists');
    }

    // Transaction: create workspace + add user as OWNER
    const workspace = await this.prisma.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: { name: dto.name, slug: dto.slug, logo: dto.logo },
      });
      await tx.workspaceMember.create({
        data: { userId, workspaceId: ws.id, role: 'OWNER' },
      });
      return ws;
    });

    return workspace;
  }

  async findAllByUser(userId: string) {
    const members = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
    });

    return members.map((m) => ({
      ...m.workspace,
      role: m.role,
    }));
  }

  async findById(workspaceId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async update(workspaceId: string, dto: UpdateWorkspaceDto) {
    // Check slug unique if changed
    if (dto.slug) {
      const existing = await this.prisma.workspace.findFirst({
        where: { slug: dto.slug, NOT: { id: workspaceId } },
      });
      if (existing) {
        throw new ConflictException('Workspace slug already exists');
      }
    }

    return this.prisma.workspace.update({
      where: { id: workspaceId },
      data: dto,
    });
  }

  async delete(workspaceId: string) {
    await this.prisma.workspace.delete({ where: { id: workspaceId } });
    return { message: 'Workspace deleted successfully' };
  }

  // === Member management ===

  async getMembers(workspaceId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async inviteMember(workspaceId: string, dto: InviteMemberDto, inviterUserId: string) {
    // Get workspace name for email
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Cannot invite as OWNER
    if (dto.role === 'OWNER') {
      throw new ForbiddenException('Cannot invite as OWNER');
    }

    // Check if email is already a member
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (user) {
      const existingMember = await this.prisma.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: user.id, workspaceId } },
      });
      if (existingMember) {
        throw new ConflictException('User is already a member');
      }
    }

    // Check if invitation already pending
    const existingInvite = await this.prisma.workspaceInvitation.findUnique({
      where: { workspaceId_email: { workspaceId, email: dto.email } },
    });
    if (existingInvite) {
      throw new ConflictException('Invitation already sent');
    }

    // Generate token and create invitation
    const token = randomBytes(32).toString('hex');
    await this.prisma.workspaceInvitation.create({
      data: {
        workspaceId,
        email: dto.email,
        role: dto.role || 'MEMBER',
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Send invitation email
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const inviteUrl = `${frontendUrl}/invite/${token}`;
    await this.emailService.sendMail(
      dto.email,
      `Moi tham gia workspace "${workspace.name}" - DevTeamOS`,
      `
        <h2>Ban duoc moi tham gia workspace!</h2>
        <p>Ban da duoc moi tham gia workspace "<strong>${workspace.name}</strong>" tren DevTeamOS.</p>
        <a href="${inviteUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;">
          Tham gia workspace
        </a>
        <p>Link nay se het han sau 7 ngay.</p>
      `,
    );

    return { message: 'Invitation sent successfully' };
  }

  async removeMember(workspaceId: string, targetUserId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.role === 'OWNER') {
      throw new ForbiddenException('Cannot remove workspace owner');
    }

    await this.prisma.workspaceMember.delete({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });

    return { message: 'Member removed successfully' };
  }

  async updateMemberRole(workspaceId: string, targetUserId: string, dto: UpdateMemberRoleDto) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.role === 'OWNER') {
      throw new ForbiddenException('Cannot change owner role');
    }

    if (dto.role === 'OWNER') {
      throw new ForbiddenException('Cannot assign OWNER role');
    }

    return this.prisma.workspaceMember.update({
      where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
      data: { role: dto.role },
    });
  }

  async joinByToken(token: string, userId: string, userEmail: string) {
    const invitation = await this.prisma.workspaceInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation expired');
    }

    if (invitation.email.toLowerCase().trim() !== userEmail.toLowerCase().trim()) {
      throw new ForbiddenException('This invitation is not for your account');
    }

    // Check if already a member
    const existing = await this.prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId, workspaceId: invitation.workspaceId } },
    });
    if (existing) {
      throw new ConflictException('You are already a member of this workspace');
    }

    // Transaction: create member + delete invitation
    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceMember.create({
        data: { userId, workspaceId: invitation.workspaceId, role: invitation.role },
      });
      await tx.workspaceInvitation.delete({ where: { id: invitation.id } });
    });

    return { message: 'Joined workspace successfully', workspaceId: invitation.workspaceId };
  }
}
