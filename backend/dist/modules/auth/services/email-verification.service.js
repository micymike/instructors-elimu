"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../../users/schemas/user.schema");
let EmailVerificationService = class EmailVerificationService {
    constructor(configService, userModel) {
        this.configService = configService;
        this.userModel = userModel;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_SERVER'),
            port: this.configService.get('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASSWORD')
            }
        });
    }
    async generateVerificationToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    async sendVerificationEmail(email, token) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            const verificationLink = `http://localhost:3001/verify-email?token=${token}`;
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
            const info = await transporter.sendMail(mailOptions);
            console.log('Verification email sent:', info.response);
        }
        catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    }
    async confirmEmailVerification(token) {
        if (!token) {
            throw new Error('Verification token is required');
        }
        try {
            const user = await this.userModel.findOne({
                emailVerificationToken: token,
                emailVerificationTokenExpires: { $gt: new Date() }
            });
            if (!user) {
                throw new Error('Invalid or expired verification token');
            }
            user.isVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationTokenExpires = undefined;
            await user.save();
            return { message: 'Email verified successfully' };
        }
        catch (error) {
            console.error('Email verification error:', error);
            throw new Error(error.message || 'Failed to verify email');
        }
    }
    isErrorWithMessage(error) {
        return (error !== null &&
            typeof error === 'object' &&
            'message' in error &&
            typeof error.message === 'string');
    }
    async verifyEmail(email, firstName, lastName) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
        if (!firstName || !firstName.trim()) {
            throw new Error('First name is required');
        }
        if (!lastName || !lastName.trim()) {
            throw new Error('Last name is required');
        }
        try {
            let user = await this.userModel.findOne({ email });
            if (!user) {
                user = await this.userModel.create({
                    email,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    password: 'temporary',
                    isVerified: false,
                    role: 'instructor'
                });
            }
            else {
                user.firstName = firstName.trim();
                user.lastName = lastName.trim();
                await user.save();
            }
            const verificationToken = await this.generateVerificationToken();
            user.emailVerificationToken = verificationToken;
            user.emailVerificationTokenExpires = new Date(Date.now() + 3600000);
            await user.save();
            await this.sendVerificationEmail(email, verificationToken);
            return { userId: user._id.toString() };
        }
        catch (error) {
            console.error('Email verification error:', error);
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors)
                    .filter(err => this.isErrorWithMessage(err))
                    .map(err => err.message)
                    .join(', ');
                throw new Error(`Validation failed: ${validationErrors}`);
            }
            const errorMessage = this.isErrorWithMessage(error)
                ? error.message
                : 'Failed to verify email';
            throw new Error(errorMessage);
        }
    }
};
exports.EmailVerificationService = EmailVerificationService;
exports.EmailVerificationService = EmailVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], EmailVerificationService);
//# sourceMappingURL=email-verification.service.js.map