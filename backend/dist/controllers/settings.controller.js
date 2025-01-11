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
var SettingsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const settings_service_1 = require("../services/settings.service");
const config_1 = require("@nestjs/config");
const jwt = __importStar(require("jsonwebtoken"));
let SettingsController = SettingsController_1 = class SettingsController {
    constructor(settingsService, configService) {
        this.settingsService = settingsService;
        this.configService = configService;
        this.logger = new common_1.Logger(SettingsController_1.name);
    }
    async getUserSettings(req, includeProfilePicture) {
        try {
            this.logger.log(`Incoming settings request headers: ${JSON.stringify(req.headers)}`);
            this.logger.log(`Include profile picture: ${includeProfilePicture}`);
            const user = await this.authenticateRequest(req);
            this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
            const settings = await this.settingsService.getUserSettings(user.email, includeProfilePicture);
            return {
                message: 'User settings retrieved successfully',
                data: settings
            };
        }
        catch (error) {
            this.logger.error('Error retrieving user settings', error.stack);
            throw error;
        }
    }
    async updateUserSettings(req, settingsData, profilePicture) {
        try {
            this.logger.log(`Incoming update settings request headers: ${JSON.stringify(req.headers)}`);
            this.logger.log(`Incoming update settings data: ${JSON.stringify(settingsData)}`);
            const user = await this.authenticateRequest(req);
            this.logger.log(`Authenticated user: ${JSON.stringify(user)}`);
            const updateData = {
                ...settingsData,
                profilePicture: profilePicture ? {
                    originalName: profilePicture.originalname,
                    mimetype: profilePicture.mimetype,
                    buffer: profilePicture.buffer.toString('base64')
                } : undefined
            };
            const updatedSettings = await this.settingsService.updateUserSettings(user.email, updateData);
            return {
                message: 'User settings updated successfully',
                data: updatedSettings
            };
        }
        catch (error) {
            this.logger.error('Error updating user settings', error.stack);
            throw error;
        }
    }
    async authenticateRequest(req) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            throw new common_2.UnauthorizedException('No authorization token');
        }
        try {
            const token = authHeader.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : authHeader;
            const decoded = jwt.decode(token);
            if (!decoded) {
                throw new common_2.UnauthorizedException('Invalid token format');
            }
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTimestamp) {
                throw new common_2.UnauthorizedException('Token has expired');
            }
            if (!decoded.email) {
                throw new common_2.UnauthorizedException('Token missing required fields');
            }
            this.logger.log('Token Decoded Successfully', {
                email: decoded.email,
                isExpired: decoded.exp ? decoded.exp < currentTimestamp : false
            });
            return {
                id: decoded.sub || decoded.email,
                sub: decoded.sub || decoded.email,
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
            if (error instanceof common_2.UnauthorizedException) {
                throw error;
            }
            throw new common_2.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includeProfilePicture')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getUserSettings", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "updateUserSettings", null);
exports.SettingsController = SettingsController = SettingsController_1 = __decorate([
    (0, common_1.Controller)('api/settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        config_1.ConfigService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map