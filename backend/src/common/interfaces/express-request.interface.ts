import { Request } from 'express';
import { User } from '../../users/schemas/user.schema';

// Create a type that matches the User schema but allows optional properties
export type AuthenticatedUser = Partial<User> & {
  email: string;
  role: string;
  id?: string;
  sub?: string;
};

// Extend the Request type without using inheritance
export interface ExpressRequest extends Request {
  user?: AuthenticatedUser;
}
