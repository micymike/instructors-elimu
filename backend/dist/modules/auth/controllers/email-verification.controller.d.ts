import { HttpStatus } from '@nestjs/common';
import { EmailVerificationService } from '../services/email-verification.service';
export declare class EmailVerificationController {
    private readonly emailVerificationService;
    constructor(emailVerificationService: EmailVerificationService);
    verifyEmail(email: string, firstName: string, lastName: string): Promise<{
        userId: string;
        statusCode: HttpStatus;
        message: string;
    } | {
        statusCode: HttpStatus;
        message: any;
    }>;
    verifyEmailToken(token: string): Promise<{
        statusCode: HttpStatus;
        message: any;
    }>;
}
