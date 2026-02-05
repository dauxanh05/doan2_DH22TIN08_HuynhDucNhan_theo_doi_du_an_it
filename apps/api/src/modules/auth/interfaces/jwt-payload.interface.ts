/**
 * JWT Payload Interface
 *
 * Data embedded inside JWT token.
 * When user logs in, this info is encoded into the token.
 * When token is verified, this info is extracted and attached to request.
 */
export interface JwtPayload {
  sub: string; // subject - user ID (standard JWT claim)
  email: string;
  type: 'access' | 'refresh'; // distinguish token types
}

/**
 * Validated user object attached to request after JWT verification
 */
export interface JwtUser {
  id: string;
  email: string;
}
