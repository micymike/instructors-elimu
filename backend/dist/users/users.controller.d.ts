import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(id: string): Promise<any>;
    updateProfile(id: string, updateUserDto: any): Promise<import("./schemas/user.schema").UserDocument>;
    updatePreferences(id: string, preferences: any): Promise<import("./schemas/user.schema").UserDocument>;
    verifyEmail(token: string): Promise<import("./schemas/user.schema").UserDocument>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, password: string): Promise<{
        message: string;
    }>;
}
