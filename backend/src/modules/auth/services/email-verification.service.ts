import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../users/schemas/user.schema';

@Injectable()
export class EmailVerificationService {
    private transporter: nodemailer.Transporter;

    constructor(
        private configService: ConfigService,
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_SERVER'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false, // Use TLS
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASSWORD')
            }
        });
    }

    async generateVerificationToken(): Promise<string> {
        return randomBytes(32).toString('hex');
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        try {
            // Create a transporter using SMTP
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false, // Use TLS
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    // Do not fail on invalid certs
                    rejectUnauthorized: false
                }
            });

            // Verification link pointing to frontend
            const verificationLink = `http://localhost:3001/verify-email?token=${token}`;

            // Email options
            const mailOptions = {
                from: `"Elimu Platform" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Email Verification for Elimu Platform',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2>Verify Your Email</h2>
                        <p>Click the button below to verify your email address:</p>
                        <a href="${verificationLink}" 
                           style="background-color: #4CAF50; 
                                  color: white; 
                                  padding: 10px 20px; 
                                  text-decoration: none; 
                                  display: inline-block; 
                                  border-radius: 5px;">
                            Verify Email
                        </a>
                        <p>If the button doesn't work, copy and paste this link:</p>
                        <p>${verificationLink}</p>
                        <p>This link will expire in 1 hour.</p>
                    </div>
                `
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            console.log('Verification email sent:', info.response);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    }

    async confirmEmailVerification(token: string): Promise<{ message: string }> {
        if (!token) {
            throw new Error('Verification token is required');
        }

        try {
            // Find user with the verification token
            const user = await this.userModel.findOne({ 
                emailVerificationToken: token,
                emailVerificationTokenExpires: { $gt: new Date() }
            });

            if (!user) {
                throw new Error('Invalid or expired verification token');
            }

            // Mark user as verified
            user.isVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationTokenExpires = undefined;

            await user.save();

            return { message: 'Email verified successfully' };
        } catch (error) {
            console.error('Email verification error:', error);
            throw new Error(error.message || 'Failed to verify email');
        }
    }

    // Type guard to check if error has a message property
    private isErrorWithMessage(error: unknown): error is Error {
        return (
            error !== null &&
            typeof error === 'object' &&
            'message' in error &&
            typeof (error as Error).message === 'string'
        );
    }

    async verifyEmail(
        email: string, 
        firstName: string, 
        lastName: string
    ): Promise<{ userId: string }> {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // Validate first and last name
        if (!firstName || !firstName.trim()) {
            throw new Error('First name is required');
        }

        if (!lastName || !lastName.trim()) {
            throw new Error('Last name is required');
        }

        try {
            // Check if user exists, if not create a new user
            let user = await this.userModel.findOne({ email });

            if (!user) {
                // Create a new user with required fields
                user = await this.userModel.create({
                    email,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    password: 'temporary', // Temporary password that will be changed later
                    isVerified: false,
                    role: 'instructor'
                });
            } else {
                // Update existing user's name if needed
                user.firstName = firstName.trim();
                user.lastName = lastName.trim();
                await user.save();
            }

            // Generate verification token
            const verificationToken = await this.generateVerificationToken();
            user.emailVerificationToken = verificationToken;
            user.emailVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();

            // Send verification email
            await this.sendVerificationEmail(email, verificationToken);

            return { userId: user._id.toString() };
        } catch (error) {
            console.error('Email verification error:', error);
            
            // If it's a validation error, provide more specific message
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors)
                    .filter(err => this.isErrorWithMessage(err))
                    .map(err => (err as Error).message)
                    .join(', ');
                throw new Error(`Validation failed: ${validationErrors}`);
            }
            
            // Handle other types of errors
            const errorMessage = this.isErrorWithMessage(error) 
                ? error.message 
                : 'Failed to verify email';
            
            throw new Error(errorMessage);
        }
    }
}
