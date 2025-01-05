import { Request } from 'express';
import { User } from '../../users/schemas/user.schema';
export type AuthenticatedUser = Partial<User> & {
    email: string;
    role: string;
    id?: string;
    sub?: string;
};
export interface ExpressRequest extends Request {
    user?: AuthenticatedUser;
}
