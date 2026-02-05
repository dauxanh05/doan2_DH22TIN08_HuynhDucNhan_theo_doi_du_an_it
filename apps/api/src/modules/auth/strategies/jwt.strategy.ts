import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, JwtUser } from '../interfaces/jwt-payload.interface';

/**
 * JWT Strategy for Passport
 *
 * How it works:
 * 1. Request comes with header "Authorization: Bearer <token>"
 * 2. ExtractJwt.fromAuthHeaderAsBearerToken() extracts the token
 * 3. Passport verifies token signature using JWT_SECRET
 * 4. If valid, validate() method is called with decoded payload
 * 5. Return value from validate() is attached to req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      // Extract token from Authorization header (Bearer scheme)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Don't ignore expiration - reject expired tokens
      ignoreExpiration: false,
      // Secret to verify token signature
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Called after token is verified
   * @param payload - Decoded JWT payload
   * @returns User object to attach to request
   */
  validate(payload: JwtPayload): JwtUser {
    // Reject refresh tokens used as access tokens
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // Return user object - this will be available as req.user
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
