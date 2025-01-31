"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationController = void 0;
const common_1 = require("@nestjs/common");
const email_verification_service_1 = require("../services/email-verification.service");
let EmailVerificationController = class EmailVerificationController {
    constructor(emailVerificationService) {
        this.emailVerificationService = emailVerificationService;
    }
    async verifyEmail(email, firstName, lastName) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Invalid email format'
            };
        }
        if (!firstName || !firstName.trim()) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'First name is required'
            };
        }
        if (!lastName || !lastName.trim()) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Last name is required'
            };
        }
        try {
            const result = await this.emailVerificationService.verifyEmail(email, firstName, lastName);
            return Object.assign({ statusCode: common_1.HttpStatus.OK, message: 'Verification email sent' }, result);
        }
        catch (error) {
            console.error('Email verification error:', error);
            return {
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message || 'Failed to verify email',
            };
        }
    }
    async verifyEmailToken(token) {
        try {
            const result = await this.emailVerificationService.confirmEmailVerification(token);
            return Object.assign({ statusCode: common_1.HttpStatus.OK, message: 'Email verified successfully' }, result);
        }
        catch (error) {
            return {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: error.message || 'Failed to verify email'
            };
        }
    }
};
exports.EmailVerificationController = EmailVerificationController;
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('firstName')),
    __param(2, (0, common_1.Body)('lastName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmailVerificationController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Get)('verify-email-token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmailVerificationController.prototype, "verifyEmailToken", null);
exports.EmailVerificationController = EmailVerificationController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [email_verification_service_1.EmailVerificationService])
], EmailVerificationController);
//# sourceMappingURL=email-verification.controller.js.map