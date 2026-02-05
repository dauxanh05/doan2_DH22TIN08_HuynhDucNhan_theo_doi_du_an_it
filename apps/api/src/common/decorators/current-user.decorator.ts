import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../../modules/auth/interfaces/jwt-payload.interface';

/**
 * CurrentUser Decorator
 *
 * Extract current user from request after JWT authentication.
 *
 * Usage:
 *   @Get('profile')
 *   @UseGuards(JwtAuthGuard)
 *   getProfile(@CurrentUser() user: JwtUser) {
 *     return user; // { id: '...', email: '...' }
 *   }
 *
 *   // Get specific property
 *   getProfile(@CurrentUser('id') userId: string) {
 *     return userId; // just the ID
 *   }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): JwtUser | string => {
    // Get request object from execution context
    const request = ctx.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    // If specific property requested, return just that property
    if (data) {
      return user[data];
    }

    // Otherwise return full user object
    return user;
  },
);
