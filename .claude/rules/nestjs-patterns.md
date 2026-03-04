---
paths:
  - "apps/api/**/*.module.ts"
  - "apps/api/**/*.controller.ts"
  - "apps/api/**/*.service.ts"
  - "apps/api/**/*.guard.ts"
  - "apps/api/**/*.decorator.ts"
  - "apps/api/**/*.interceptor.ts"
---

# NestJS Deep Patterns

> Tu dong load khi lam viec voi NestJS files. Extracted tu backend-architect + api-design-principles skills.

## Module Registration Pattern

```typescript
// Feature module PHAI register trong app.module.ts
@Module({
  imports: [PrismaModule, OtherModule],  // dependencies
  controllers: [XxxController],
  providers: [XxxService],
  exports: [XxxService],  // CHI export neu module khac can dung
})
export class XxxModule {}
```

**Checklist module moi:**
- [ ] Tao `xxx.module.ts`, `xxx.controller.ts`, `xxx.service.ts`
- [ ] Register trong `app.module.ts` imports
- [ ] Them `@ApiTags('xxx')` trong controller
- [ ] DTO files trong `dto/` subfolder

## Guard Stacking Pattern

```typescript
// Thu tu: Auth → Role → Custom
@UseGuards(JwtAuthGuard, WorkspaceRoleGuard)
@Roles(Role.ADMIN, Role.OWNER)
@ApiBearerAuth()
```

- Guards chay LEFT → RIGHT
- JwtAuthGuard LUON dat truoc RolesGuard
- `@Roles()` decorator set metadata, guard doc metadata

## Service Pattern — Ownership Check

```typescript
// LUON verify ownership truoc khi update/delete
async update(id: string, userId: string, dto: UpdateXxxDto) {
  const item = await this.prisma.xxx.findUnique({ where: { id } });
  if (!item) throw new NotFoundException('Item not found');
  if (item.userId !== userId) throw new ForbiddenException('Not your item');
  return this.prisma.xxx.update({ where: { id }, data: dto });
}
```

## Pagination Pattern

```typescript
// Standard pagination cho list endpoints
async findAll(page = 1, limit = 20, filters?: FilterDto) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.prisma.xxx.findMany({ skip, take: limit, where: filters, orderBy: { createdAt: 'desc' } }),
    this.prisma.xxx.count({ where: filters }),
  ]);
  return { data, total, page, limit };
}
```

## Swagger Decorators

```typescript
@ApiTags('resources')
@ApiBearerAuth()
@Controller('resources')
export class ResourceController {
  @Post()
  @ApiOperation({ summary: 'Create resource' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Already exists' })
  create(@Body() dto: CreateResourceDto) {}
}
```

## Transaction Pattern

```typescript
// Khi can atomic operations (nhieu writes phu thuoc nhau)
await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.update({ ... });
  await tx.notification.create({ ... });
  return user;
});
```

- Dung `$transaction` khi 2+ writes PHAI thanh cong cung luc
- KHONG dung cho 1 write don le
- Truyen `tx` (transaction client) thay vi `this.prisma` ben trong callback

## Common Pitfalls — NestJS Specific

- **Circular dependency**: Dung `forwardRef(() => Module)` hoac tach shared service
- **Missing provider**: Neu inject service → phai register trong providers[] cua module
- **Guard vs Interceptor**: Guard = allow/deny, Interceptor = transform request/response
- **Pipe scope**: ValidationPipe da global, KHONG can them per-method
