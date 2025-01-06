import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    Query, 
    Res, 
    HttpCode, 
    HttpStatus 
} from '@nestjs/common';
import { Response } from 'express';
import { EmailVerificationService } from '../services/email-verification.service';

@Controller('auth')
export class EmailVerificationController {
    constructor(
        private readonly emailVerificationService: EmailVerificationService
    ) {}

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    async verifyEmail(
        @Body('email') email: string,
        @Body('firstName') firstName: string,
        @Body('lastName') lastName: string
    ) {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid email format'
            };
        }

        // Validate first and last name
        if (!firstName || !firstName.trim()) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'First name is required'
            };
        }

        if (!lastName || !lastName.trim()) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Last name is required'
            };
        }

        try {
            const result = await this.emailVerificationService.verifyEmail(
                email, 
                firstName, 
                lastName
            );
            return {
                statusCode: HttpStatus.OK,
                message: 'Verification email sent',
                ...result
            };
        } catch (error) {
            console.error('Email verification error:', error);
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to verify email',
            };
        }
    }

    @Get('verify-email-token')
    @HttpCode(HttpStatus.OK)
    async verifyEmailToken(
        @Query('token') token: string
    ) {
        try {
            // Verify the token
            const result = await this.emailVerificationService.confirmEmailVerification(token);

            return {
                statusCode: HttpStatus.OK,
                message: 'Email verified successfully',
                ...result
            };
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: error.message || 'Failed to verify email'
            };
        }
    }
}
