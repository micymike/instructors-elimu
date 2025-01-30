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
exports.CourseContentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_content_schema_1 = require("./course-content.schema");
const cloudinary_service_1 = require("../modules/cloudinary/cloudinary.service");
let CourseContentService = class CourseContentService {
    constructor(contentModel, cloudinaryService) {
        this.contentModel = contentModel;
        this.cloudinaryService = cloudinaryService;
    }
    async createContent(courseId, moduleId, createContentDto) {
        let videoUrl;
        let pdfUrl;
        if (createContentDto.video) {
            videoUrl = await this.cloudinaryService.uploadVideo(createContentDto.video, 'course-videos');
        }
        if (createContentDto.pdf) {
            pdfUrl = await this.cloudinaryService.uploadFile(createContentDto.pdf, 'course-pdfs');
        }
        const newContent = new this.contentModel(Object.assign(Object.assign({}, createContentDto), { courseId, moduleId, videoUrl, pdfUrl }));
        return newContent.save();
    }
    async updateContent(courseId, moduleId, contentId, updateContentDto) {
        const existingContent = await this.contentModel.findOneAndUpdate({ _id: contentId, courseId, moduleId }, updateContentDto, { new: true });
        if (!existingContent) {
            throw new common_1.NotFoundException(`Content with ID ${contentId} not found`);
        }
        return existingContent;
    }
    async deleteContent(courseId, moduleId, contentId) {
        const result = await this.contentModel.deleteOne({ _id: contentId, courseId, moduleId });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Content with ID ${contentId} not found`);
        }
    }
    async getContent(courseId, moduleId) {
        return this.contentModel.find({ courseId, moduleId }).exec();
    }
    async getContentById(courseId, moduleId, contentId) {
        const content = await this.contentModel.findOne({ _id: contentId, courseId, moduleId }).exec();
        if (!content) {
            throw new common_1.NotFoundException(`Content with ID ${contentId} not found`);
        }
        return content;
    }
};
exports.CourseContentService = CourseContentService;
exports.CourseContentService = CourseContentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_content_schema_1.CourseContent.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cloudinary_service_1.CloudinaryService])
], CourseContentService);
//# sourceMappingURL=course-content.service.js.map