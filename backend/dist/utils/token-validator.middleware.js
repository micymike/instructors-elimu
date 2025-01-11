"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidatorMiddleware = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let TokenValidatorMiddleware = class TokenValidatorMiddleware {
    constructor() {
        this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
    }
    async use(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new common_1.UnauthorizedException('No authorization header');
            }
            const token = authHeader.split(' ')[1];
            const response = await axios_1.default.post(`${this.centralizedAuthUrl}/auth/validate`, { token }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            if (!response.data.isValid) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            req.user = response.data.user;
            next();
        }
        catch (error) {
            console.error('Token validation error:', error);
            throw new common_1.UnauthorizedException('Authentication failed');
        }
    }
};
exports.TokenValidatorMiddleware = TokenValidatorMiddleware;
exports.TokenValidatorMiddleware = TokenValidatorMiddleware = __decorate([
    (0, common_1.Injectable)()
], TokenValidatorMiddleware);
//# sourceMappingURL=token-validator.middleware.js.map