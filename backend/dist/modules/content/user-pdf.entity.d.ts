import { User } from '../user/user.entity';
export declare class UserPDF {
    id: string;
    filename: string;
    filepath: string;
    size: number;
    user: User;
    userId: string;
    createdAt: Date;
}
