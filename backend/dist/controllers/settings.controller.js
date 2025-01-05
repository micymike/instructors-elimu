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
var SettingsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const settings_service_1 = require("../services/settings.service");
const config_1 = require("@nestjs/config");
const jwt = require("jsonwebtoken");
let SettingsController = SettingsController_1 = class SettingsController {
    constructor(settingsService, configService) {
        this.settingsService = settingsService;
        this.configService = configService;
        this.logger = new common_1.Logger(SettingsController_1.name);
    }
    async getUserSettings(req) {
        try {
            this.logger.log(`Incoming settings request headers: ${JSON.stringify(req.headers)}`);
            const user = await this.authenticateRequest(req);
            this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
            const settings = await this.settingsService.getUserSettings(user.email);
            return {
                message: 'User settings retrieved successfully',
                data: settings
            };
        }
        catch (error) {
            this.logger.error('Error retrieving user settings', error.stack);
            if (error instanceof common_2.UnauthorizedException) {
                throw new common_2.UnauthorizedException('Unauthorized to retrieve user settings');
            }
            else {
                throw new common_2.InternalServerErrorException('Failed to retrieve user settings');
            }
        }
    }
    async authenticateRequest(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            this.logger.error('Authorization header missing');
            throw new common_2.UnauthorizedException('Authorization header missing');
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            this.logger.error('Token missing');
            throw new common_2.UnauthorizedException('Token missing');
        }
        try {
            const decodedWithoutVerify = jwt.decode(token);
            this.logger.log(`Decoded Token (without verification): ${JSON.stringify(decodedWithoutVerify)}`);
            const authSecret = this.configService.get('AUTH_SECRET');
            if (!authSecret) {
                this.logger.error('AUTH_SECRET is not defined in environment');
                throw new common_2.UnauthorizedException('JWT configuration error');
            }
            const decoded = jwt.verify(token, authSecret);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (!decoded.email) {
                this.logger.error('Token missing required fields');
                throw new common_2.UnauthorizedException('Token missing required fields');
            }
            return {
                email: decoded.email,
                role: decoded.role || 'instructor'
            };
        }
        catch (error) {
            this.logger.error('Token Verification Failed', {
                error: error.message,
                name: error.name,
                stack: error.stack
            });
            if (error.name === 'JsonWebTokenError') {
                throw new common_2.UnauthorizedException('Invalid token format');
            }
            else if (error.name === 'TokenExpiredError') {
                throw new common_2.UnauthorizedException('Token has expired');
            }
            throw new common_2.UnauthorizedException('Invalid token');
        }
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getUserSettings", null);
exports.SettingsController = SettingsController = SettingsController_1 = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        config_1.ConfigService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map