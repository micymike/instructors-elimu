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
exports.CourseContentController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const course_content_service_1 = require("./course-content.service");
const content_dto_1 = require("./dto/content.dto");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let CourseContentController = class CourseContentController {
    constructor(courseContentService) {
        this.courseContentService = courseContentService;
    }
    async createContent(courseId, moduleId, createContentDto, files) {
        const videoFile = files.find(file => file.mimetype.startsWith('video/'));
        const pdfFile = files.find(file => file.mimetype === 'application/pdf');
        if (videoFile) {
            createContentDto.video = {
                originalname: videoFile.originalname,
                buffer: videoFile.buffer,
                mimetype: videoFile.mimetype,
            };
        }
        if (pdfFile) {
            createContentDto.pdf = {
                originalname: pdfFile.originalname,
                buffer: pdfFile.buffer,
                mimetype: pdfFile.mimetype,
            };
        }
        return this.courseContentService.createContent(courseId, moduleId, createContentDto);
    }
    async updateContent(courseId, moduleId, contentId, updateContentDto) {
        const content = await this.courseContentService.updateContent(courseId, moduleId, contentId, updateContentDto);
        this.server.emit('contentUpdate', { courseId, moduleId, content });
        return content;
    }
    async deleteContent(courseId, moduleId, contentId) {
        await this.courseContentService.deleteContent(courseId, moduleId, contentId);
        this.server.emit('contentUpdate', { courseId, moduleId, contentId });
        return { message: 'Content deleted successfully' };
    }
    async getContent(courseId, moduleId) {
        return this.courseContentService.getContent(courseId, moduleId);
    }
    async getContentById(courseId, moduleId, contentId) {
        return this.courseContentService.getContentById(courseId, moduleId, contentId);
    }
};
exports.CourseContentController = CourseContentController;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CourseContentController.prototype, "server", void 0);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, content_dto_1.CreateContentDto, Array]),
    __metadata("design:returntype", Promise)
], CourseContentController.prototype, "createContent", null);
__decorate([
    (0, common_1.Put)(':contentId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('contentId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, content_dto_1.UpdateContentDto]),
    __metadata("design:returntype", Promise)
], CourseContentController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)(':contentId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('contentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CourseContentController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CourseContentController.prototype, "getContent", null);
__decorate([
    (0, common_1.Get)(':contentId'),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('contentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CourseContentController.prototype, "getContentById", null);
exports.CourseContentController = CourseContentController = __decorate([
    (0, common_1.Controller)('courses/:courseId/modules/:moduleId/content'),
    __metadata("design:paramtypes", [course_content_service_1.CourseContentService])
], CourseContentController);
//# sourceMappingURL=course-content.controller.js.map