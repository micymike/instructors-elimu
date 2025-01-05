export interface User {
  id: string;
  sub: string;
  email: string;
  role: string;
}

export interface TokenPayload extends Partial<User> {
  id?: string;
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}
