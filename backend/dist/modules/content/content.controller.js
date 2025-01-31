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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const content_service_1 = require("./content.service");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
const node_fetch_1 = __importDefault(require("node-fetch"));
let ContentController = class ContentController {
    constructor(contentService, jwtService) {
        this.contentService = contentService;
        this.jwtService = jwtService;
    }
    async getDocuments(authHeader, search, type, priceRange, sortBy) {
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        if (!token) {
            throw new common_2.UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.verify(token);
            const userId = decoded.sub;
            return this.contentService.getDocuments({
                search,
                type,
                priceRange,
                sortBy,
                instructorId: userId
            });
        }
        catch (error) {
            throw new common_2.UnauthorizedException('Invalid or expired token');
        }
    }
    async uploadDocument(userId, file, title, type, price, tags) {
        return this.contentService.uploadDocument({
            file,
            title,
            type,
            price,
            instructorId: userId,
            tags: tags || []
        });
    }
    async checkPlagiarism(documentId) {
        return this.contentService.checkPlagiarism(documentId);
    }
    async previewDocument(documentId, authHeader, res) {
        try {
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
            if (!token) {
                throw new common_2.UnauthorizedException('No token provided');
            }
            const decoded = this.jwtService.verify(token);
            const userId = decoded.sub;
            const document = await this.contentService.findDocumentById(documentId, userId);
            if (!document.cloudinaryUrl) {
                throw new common_2.NotFoundException('Document not found');
            }
            const response = await (0, node_fetch_1.default)(document.cloudinaryUrl);
            const fileBuffer = await response.buffer();
            res.type('application/pdf');
            res.send(fileBuffer);
        }
        catch (error) {
            if (error instanceof common_2.UnauthorizedException || error instanceof common_2.ForbiddenException) {
                res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    message: error.message
                });
            }
            else if (error instanceof common_2.NotFoundException) {
                res.status(common_1.HttpStatus.NOT_FOUND).json({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: error.message
                });
            }
            else {
                console.error('Document preview error:', error);
                res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to preview document'
                });
            }
        }
    }
    async downloadDocument(documentId, authHeader, res) {
        try {
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
            if (!token) {
                throw new common_2.UnauthorizedException('No token provided');
            }
            const decoded = this.jwtService.verify(token);
            const userId = decoded.sub;
            const document = await this.contentService.findDocumentById(documentId, userId);
            if (!document.cloudinaryUrl) {
                throw new common_2.NotFoundException('Document not found');
            }
            const response = await (0, node_fetch_1.default)(document.cloudinaryUrl);
            const fileBuffer = await response.buffer();
            res.type('application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);
            res.send(fileBuffer);
        }
        catch (error) {
            if (error instanceof common_2.UnauthorizedException || error instanceof common_2.ForbiddenException) {
                res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    statusCode: common_1.HttpStatus.UNAUTHORIZED,
                    message: error.message
                });
            }
            else if (error instanceof common_2.NotFoundException) {
                res.status(common_1.HttpStatus.NOT_FOUND).json({
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: error.message
                });
            }
            else {
                console.error('Document download error:', error);
                res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to download document'
                });
            }
        }
    }
    async deleteDocument(userId, id) {
        return this.contentService.deleteDocument(id, userId);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('priceRange')),
    __param(4, (0, common_1.Query)('sortBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('type')),
    __param(4, (0, common_1.Body)('price')),
    __param(5, (0, common_1.Body)('tags')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, Number, Array]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)('check-plagiarism'),
    __param(0, (0, common_1.Body)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "checkPlagiarism", null);
__decorate([
    (0, common_1.Get)(':id/preview'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "previewDocument", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('authorization')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "downloadDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Headers)('x-user-id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "deleteDocument", null);
exports.ContentController = ContentController = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [content_service_1.ContentService, jwt_1.JwtService])
], ContentController);
//# sourceMappingURL=content.controller.js.map