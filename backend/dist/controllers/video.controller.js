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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const video_service_1 = require("../services/video.service");
const video_dto_1 = require("../dto/video.dto");
const user_decorator_1 = require("../decorators/user.decorator");
const parse_objectid_pipe_1 = require("../pipes/parse-objectid.pipe");
let VideoController = class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }
    async create(createVideoDto, instructorId) {
        return this.videoService.create(createVideoDto, instructorId);
    }
    async findAll(instructorId, visibility, tags, search, page, limit, sort) {
        return this.videoService.findAll(instructorId, {
            visibility,
            tags,
            search,
            page,
            limit,
            sort,
        });
    }
    async findOne(id, instructorId) {
        return this.videoService.findOne(id, instructorId);
    }
    async update(id, updateVideoDto, instructorId) {
        return this.videoService.update(id, updateVideoDto, instructorId);
    }
    async remove(id, instructorId) {
        return this.videoService.remove(id, instructorId);
    }
    async getSignature() {
        return this.videoService.getCloudinarySignature();
    }
    async incrementViews(id) {
        return this.videoService.incrementViews(id);
    }
    async addToCourse(videoId, courseId, instructorId) {
        return this.videoService.addToCourse(videoId, courseId, instructorId);
    }
    async removeFromCourse(videoId, courseId, instructorId) {
        return this.videoService.removeFromCourse(videoId, courseId, instructorId);
    }
    async validateVideo(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return this.videoService.validateVideo(file);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new video' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Video created successfully', type: video_dto_1.VideoResponseSwagger }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [video_dto_1.CreateVideoDto, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all videos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all videos', type: [video_dto_1.VideoResponseSwagger] }),
    __param(0, (0, user_decorator_1.User)('sub')),
    __param(1, (0, common_1.Query)('visibility')),
    __param(2, (0, common_1.Query)('tags')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __param(6, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a video by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return a video', type: video_dto_1.VideoResponseSwagger }),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a video' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video updated successfully', type: video_dto_1.VideoResponseSwagger }),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, video_dto_1.UpdateVideoDto, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a video' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video deleted successfully' }),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('signature'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Cloudinary upload signature' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return upload signature' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getSignature", null);
__decorate([
    (0, common_1.Post)(':id/views'),
    (0, swagger_1.ApiOperation)({ summary: 'Increment video views' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Views incremented successfully' }),
    __param(0, (0, common_1.Param)('id', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "incrementViews", null);
__decorate([
    (0, common_1.Post)(':videoId/courses/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add video to course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video added to course successfully', type: video_dto_1.VideoResponseSwagger }),
    __param(0, (0, common_1.Param)('videoId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Param)('courseId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(2, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "addToCourse", null);
__decorate([
    (0, common_1.Delete)(':videoId/courses/:courseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove video from course' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video removed from course successfully', type: video_dto_1.VideoResponseSwagger }),
    __param(0, (0, common_1.Param)('videoId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Param)('courseId', parse_objectid_pipe_1.ParseObjectIdPipe)),
    __param(2, (0, user_decorator_1.User)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "removeFromCourse", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Validate video file' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Video file validated successfully' }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "validateVideo", null);
exports.VideoController = VideoController = __decorate([
    (0, swagger_1.ApiTags)('videos'),
    (0, common_1.Controller)('api/videos'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map