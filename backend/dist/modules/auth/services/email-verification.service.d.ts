import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';
export declare class EmailVerificationService {
    private configService;
    private userModel;
    private transporter;
    constructor(configService: ConfigService, userModel: Model<User>);
    generateVerificationToken(): Promise<string>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    confirmEmailVerification(token: string): Promise<{
        message: string;
    }>;
    private isErrorWithMessage;
    verifyEmail(email: string, firstName: string, lastName: string): Promise<{
        userId: string;
    }>;
}
