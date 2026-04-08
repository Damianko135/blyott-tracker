import type { LoginRequest, LoginResponse } from './types';

// Minimal runtime validation derived from tools/blyott.swagger.json schemas.
export function assertLoginRequest(input: unknown): asserts input is LoginRequest {
  if (!input || typeof input !== 'object') {
    throw new Error('Login request must be an object');
  }

  const maybe = input as Partial<LoginRequest>;
  if (!maybe.username || typeof maybe.username !== 'string') {
    throw new Error('Login request requires username');
  }
  if (!maybe.password || typeof maybe.password !== 'string') {
    throw new Error('Login request requires password');
  }
}

export function parseLoginResponse(input: unknown): LoginResponse {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid login response payload');
  }

  const payload = input as { token?: unknown; refreshToken?: unknown };
  return {
    token: typeof payload.token === 'string' ? payload.token : null,
    refreshToken: typeof payload.refreshToken === 'string' ? payload.refreshToken : null
  };
}
