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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AuthMiddleware = class AuthMiddleware {
    constructor() {
        this.centralizedAuthUrl = 'https://centralize-auth-elimu.onrender.com';
    }
    async use(req, res, next) {
        console.log('=== AUTH MIDDLEWARE START ===');
        console.log('🔍 Detailed Request Logging:', {
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            headers: {
                authorization: req.headers.authorization ? '✅ PRESENT' : '❌ MISSING',
                contentType: req.headers['content-type']
            },
            body: req.body,
            query: req.query,
            originalUrl: req.originalUrl
        });
        const excludedRoutes = [
            '/auth',
            '/health',
            '/ping',
            '/api/auth/login',
            '/api/auth/register'
        ];
        const isExcludedRoute = excludedRoutes.some(route => req.path.startsWith(route));
        if (isExcludedRoute) {
            console.log('🟢 Route excluded from authentication');
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.error('❌ NO AUTHORIZATION HEADER');
            return res.status(401).json({
                message: 'Authorization header missing',
                statusCode: 401
            });
        }
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            console.error('❌ INVALID AUTHORIZATION HEADER FORMAT', {
                tokenParts,
                headerValue: authHeader
            });
            return res.status(401).json({
                message: 'Invalid Authorization header format',
                statusCode: 401
            });
        }
        const token = tokenParts[1];
        try {
            console.log('🔍 Attempting token validation', {
                url: `${this.centralizedAuthUrl}/auth/validate`,
                tokenLength: token.length,
                tokenFirstChars: token.substring(0, 10) + '...'
            });
            const response = await axios_1.default.post(`${this.centralizedAuthUrl}/auth/validate`, { token }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });
            console.log('✅ Token Validation Response:', {
                status: response.status,
                data: response.data
            });
            if (!response.data.isValid) {
                console.error('❌ TOKEN INVALID');
                return res.status(401).json({
                    message: 'Invalid or expired token',
                    error: 'Unauthorized',
                    statusCode: 401
                });
            }
            const tokenPayload = this.decodeToken(token);
            console.log('🔐 Decoded Token Payload:', {
                email: tokenPayload.email,
                iat: tokenPayload.iat,
                exp: tokenPayload.exp
            });
            req.user = {
                id: null,
                sub: null,
                email: tokenPayload.email || null,
                role: 'instructor'
            };
            console.log('🔐 Authentication Successful', {
                email: req.user.email
            });
            next();
        }
        catch (error) {
            console.error('❌ TOKEN VALIDATION ERROR', {
                message: error.message,
                responseStatus: error.response ? error.response.status : 'No status',
                responseData: error.response ? error.response.data : 'No response data',
                requestDetails: {
                    url: `${this.centralizedAuthUrl}/auth/validate`,
                    method: 'POST',
                    token: token ? 'Present' : 'Missing'
                }
            });
            if (error.response) {
                console.error('Full Error Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
            return res.status(401).json({
                message: 'Token validation failed',
                statusCode: 401,
                error: 'Unauthorized',
                details: error.message
            });
        }
        finally {
            console.log('=== AUTH MIDDLEWARE END ===');
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
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map