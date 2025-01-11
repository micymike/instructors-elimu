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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SettingsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const settings_service_1 = require("../services/settings.service");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let SettingsController = SettingsController_1 = class SettingsController {
    constructor(settingsService, configService) {
        this.settingsService = settingsService;
        this.configService = configService;
        this.logger = new common_1.Logger(SettingsController_1.name);
        this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
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
    async updateUserSettings(req, settingsData) {
        try {
            this.logger.log(`Incoming update settings request headers: ${JSON.stringify(req.headers)}`);
            this.logger.log(`Incoming update settings data: ${JSON.stringify(settingsData)}`);
            const user = await this.authenticateRequest(req);
            this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
            const updatedSettings = await this.settingsService.updateUserSettings(user.email, settingsData);
            return {
                message: 'User settings updated successfully',
                data: updatedSettings
            };
        }
        catch (error) {
            this.logger.error('Error updating user settings', error.stack);
            if (error instanceof common_2.UnauthorizedException) {
                throw new common_2.UnauthorizedException('Unauthorized to update user settings');
            }
            else {
                throw new common_2.InternalServerErrorException('Failed to update user settings');
            }
        }
    }
    async authenticateRequest(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new common_2.UnauthorizedException('No authorization token provided');
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                throw new common_2.UnauthorizedException('Invalid authorization token format');
            }
            const response = await axios_1.default.post(`${this.centralizedAuthUrl}/auth/validate`, { token }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            if (!response.data.isValid) {
                throw new common_2.UnauthorizedException('Invalid token');
            }
            return response.data.user;
        }
        catch (error) {
            this.logger.error('Authentication error', error.stack);
            if (error.response) {
                this.logger.error(`Auth service error: ${JSON.stringify(error.response.data)}`);
            }
            if (axios_1.default.isAxiosError(error)) {
                throw new common_2.UnauthorizedException('Token validation failed with external auth service');
            }
            throw error;
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
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateUserSettings", null);
exports.SettingsController = SettingsController = SettingsController_1 = __decorate([
    (0, common_1.Controller)('api/settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        config_1.ConfigService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map