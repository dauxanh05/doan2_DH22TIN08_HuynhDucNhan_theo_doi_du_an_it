Toi dang lam du an DevTeamOS. Day la Phase 6 (cuoi cung) cua nhanh 01-feat-auth-be.
Phase 1-5 DA HOAN THANH (toan bo auth da xong).

## Doc cac file nay de hieu context:

- `CLAUDE.md` - Project guidelines, learning mode
- `branches/01-feat-auth-be/CONTEXT.md` - Users module scope
- `apps/api/.env.example` - UPLOAD_DIR
- `apps/api/prisma/schema.prisma` - User model (name, avatar, theme, password)

## Doc cac file DA CAP NHAT (doc tat ca truoc khi sua):

- `apps/api/src/modules/users/users.module.ts` - Skeleton
- `apps/api/src/modules/users/users.controller.ts` - Chi co health check
- `apps/api/src/modules/users/users.service.ts` - Co findByEmail(), findById()
- `apps/api/src/common/guards/jwt-auth.guard.ts` - Da co
- `apps/api/src/common/decorators/current-user.decorator.ts` - Da co
- `apps/api/src/modules/auth/interfaces/jwt-payload.interface.ts` - JwtUser: { id, email }
- `apps/api/src/main.ts` - Kiem tra config hien tai

## Nhiem vu Phase 6 - Users Module & Profile:

### 1. Tao file: src/modules/users/dto/update-profile.dto.ts
- class UpdateProfileDto
- Fields (tat ca optional):
  * name?: string (@IsString, @IsOptional)
  * avatar?: string (@IsString, @IsOptional)
  * theme?: Theme (@IsEnum(Theme), @IsOptional) - import Theme tu @prisma/client
- Swagger ApiPropertyOptional

### 2. Tao file: src/modules/users/dto/change-password.dto.ts
- class ChangePasswordDto
- Fields:
  * currentPassword: string (@IsString)
  * newPassword: string (@IsString, @MinLength(6))
- Swagger ApiProperty

### 3. Cap nhat users.service.ts
Them methods (GIU LAI findByEmail, findById da co):

**getProfile(userId):**
- prisma.user.findUnique({ where: { id: userId } })
- Select: id, email, name, avatar, theme, provider, emailVerified, createdAt
- KHONG select password
- Neu khong thay: throw NotFoundException

**updateProfile(userId, dto: UpdateProfileDto):**
- prisma.user.update({ where: { id: userId }, data: { ...dto } })
- Tra ve user (KHONG co password)

**changePassword(userId, dto: ChangePasswordDto):**
- Tim user, kiem tra co password khong (Google OAuth user khong co password)
- Neu khong co password: throw BadRequestException('Tai khoan Google khong co mat khau')
- So sanh currentPassword voi hash trong DB (bcrypt.compare)
- Neu sai: throw BadRequestException('Mat khau hien tai khong dung')
- Hash newPassword
- Update trong DB
- Tra ve { message: 'Doi mat khau thanh cong' }

**uploadAvatar(userId, file: Express.Multer.File):**
- Luu file vao UPLOAD_DIR/avatars/
- Tao ten file unique: `${userId}-${Date.now()}.${ext}`
- Update avatar field trong DB voi path
- Xoa avatar cu neu co (fs.unlink)
- Tra ve { avatar: '/uploads/avatars/filename.jpg' }

### 4. Cap nhat users.controller.ts
Giu lai health check, them endpoints:

Toan bo controller can @UseGuards(JwtAuthGuard) (co the dung @UseGuards o class level)

**GET /users/me:**
- @Get('me')
- @CurrentUser('id') userId
- Goi usersService.getProfile(userId)

**PATCH /users/me:**
- @Patch('me')
- @Body() UpdateProfileDto
- @CurrentUser('id') userId
- Goi usersService.updateProfile(userId, dto)

**PATCH /users/me/password:**
- @Patch('me/password')
- @Body() ChangePasswordDto
- @CurrentUser('id') userId
- Goi usersService.changePassword(userId, dto)

**POST /users/me/avatar:**
- @Post('me/avatar')
- @UseInterceptors(FileInterceptor('avatar', { ... })) - multer config
- @UploadedFile() file
- @CurrentUser('id') userId
- Multer config:
  * storage: diskStorage({ destination: UPLOAD_DIR + '/avatars', filename: custom })
  * fileFilter: chi cho phep image (jpg, png, gif, webp)
  * limits: { fileSize: 5 * 1024 * 1024 } // 5MB
- Goi usersService.uploadAvatar(userId, file)

### 5. Cap nhat users.module.ts (neu can)
- Kiem tra da co PrismaService inject chua (PrismaModule la @Global nen khong can import)
- Them MulterModule neu can

### 6. Dam bao uploads folder
- Tao folder uploads/avatars neu chua co
- Them vao .gitignore neu chua co: /uploads

### 7. Cap nhat PROGRESS.md
Sau khi xong, cap nhat file: `branches/01-feat-auth-be/PROGRESS.md`
Noi dung:
- Trang thai: Hoan thanh
- Danh sach files da tao/sua
- Danh sach endpoints (method + path + mo ta)
- Nhung gi can luu y cho nhanh 02-feat-auth-fe

## Quy tac:

1. LEARNING MODE - giai thich:
   - Multer la gi, cach dung voi NestJS
   - FileInterceptor vs FilesInterceptor
   - Tai sao khong luu file vao DB (chi luu path)
2. DOC FILE TRUOC KHI SUA
3. bcrypt import: `import * as bcrypt from 'bcrypt'`
4. COMMIT khi xong Phase 6:
   - Hoi user author nao:
     * MinhNhut05 <leminhnut.9a10.2019@gmail.com> (origin)
     * dauxanh05 <leminhoocaolanh@gmail.com> (nhan)
   - Commit message: `feat(users): implement profile management and avatar upload`
   - Push len remote tuong ung
5. Sau khi push, bao cao tong ket:
   - Tong so files da tao/sua
   - Tat ca 13 endpoints (9 auth + 4 users)
   - Notes cho nhanh 02-feat-auth-fe
