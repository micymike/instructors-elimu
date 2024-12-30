import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            access_token: string;
            instructor: {
                id: unknown;
                email: string;
                firstName: string;
                lastName: string;
                isVerified: boolean;
                status: string;
            };
        };
    }>;
    register(registerDto: RegisterDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            access_token: string;
            instructor: {
                id: unknown;
                email: string;
                firstName: string;
                lastName: string;
                isVerified: boolean;
                status: string;
            };
        };
    }>;
}
