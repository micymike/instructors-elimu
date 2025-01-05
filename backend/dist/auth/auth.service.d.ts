import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InstructorDocument } from '../instructor/instructor.schema';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private instructorModel;
    private jwtService;
    private configService;
    constructor(instructorModel: Model<InstructorDocument>, jwtService: JwtService, configService: ConfigService);
    validateOAuthUser(user: any): Promise<any>;
    loginWithOAuth(user: any): Promise<{
        access_token: string;
    }>;
    loginWithEmailAndPassword(email: string, password: string): Promise<{
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
    register(registerDto: RegisterDto): Promise<{
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
    validateToken(token: string): Promise<boolean>;
    getUserFromToken(token: string): Promise<any>;
}
