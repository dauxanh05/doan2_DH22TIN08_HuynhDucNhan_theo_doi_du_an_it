import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard
 *
 * Usage:
 *   @UseGuards(JwtAuthGuard)
 *   @Get('profile')
 *   getProfile() { ... }
 *
 * How it works:
 * 1. Guard intercepts request before controller method
 * 2. Calls JwtStrategy to validate token
 * 3. If valid: attach user to request, proceed to controller
 * 4. If invalid: return 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Optional: Override canActivate for custom logic
   * Example: logging, additional checks, etc.
   */
  canActivate(context: ExecutionContext) {
    // Call parent implementation (runs JWT strategy)
    return super.canActivate(context);
  }
}
