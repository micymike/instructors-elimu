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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const axios_1 = require("axios");
const user_settings_schema_1 = require("../../schemas/user-settings.schema");
const instructor_service_1 = require("../../services/instructor.service");
let SettingsService = class SettingsService {
    constructor(userSettingsModel, instructorService) {
        this.userSettingsModel = userSettingsModel;
        this.instructorService = instructorService;
        this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
    }
    async validateToken(token) {
        try {
            const response = await axios_1.default.post(`${this.centralizedAuthUrl}/auth/validate`, { token }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            if (!response.data.isValid) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            return response.data.user;
        }
        catch (error) {
            console.error('Token validation error:', error);
            throw new common_1.UnauthorizedException('Token validation failed');
        }
    }
    decodeToken(token) {
        try {
            const base64Payload = token.split('.')[1];
            const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
            return JSON.parse(payload) || {};
        }
        catch (error) {
            console.error('Token decoding error:', error);
            return {};
        }
    }
    async getSettings(token) {
        const user = await this.validateToken(token);
        const tokenPayload = this.decodeToken(token);
        const email = tokenPayload.email;
        const settings = await this.userSettingsModel.findOne({ email });
        let userData = { firstName: '', lastName: '', profilePicture: '' };
        try {
            const instructor = await this.instructorService.getUserDetails(email);
            userData = {
                firstName: instructor.firstName,
                lastName: instructor.lastName,
                profilePicture: instructor.profilePicture
            };
        }
        catch (error) {
            console.warn('User data not available:', error.message);
        }
        return {
            ...settings?.toObject() || {},
            ...userData
        };
    }
    async updateSettings(updateSettingsDto, token) {
        const user = await this.validateToken(token);
        const tokenPayload = this.decodeToken(token);
        const email = tokenPayload.email;
        const updatedSettings = await this.userSettingsModel.findOneAndUpdate({ email }, { $set: { ...updateSettingsDto, email } }, { new: true, upsert: true });
        return {
            message: 'Settings updated successfully',
            settings: updatedSettings
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_settings_schema_1.UserSettings.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        instructor_service_1.InstructorService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map