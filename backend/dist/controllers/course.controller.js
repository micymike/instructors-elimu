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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const gemini_service_1 = require("../ai/gemini.service");
const course_service_1 = require("../services/course.service");
const notification_service_1 = require("../notification/notification.service");
const create_course_dto_1 = require("../dto/create-course.dto");
const update_course_dto_1 = require("../dto/update-course.dto");
const formatResponse_1 = require("../utils/formatResponse");
let CourseController = class CourseController {
    constructor(courseService, notificationService, geminiService) {
        this.courseService = courseService;
        this.notificationService = notificationService;
        this.geminiService = geminiService;
    }
    async learn(id) {
        return `Displaying course materials for course with ID ${id}`;
    }
    async create(createCourseDto) {
        const course = await this.courseService.create(createCourseDto, 'temporary-user-id');
        await this.notificationService.notifyCourseCreated(course['_id'], 'temporary-user-id', course.title);
        return (0, formatResponse_1.formatResponse)(course);
    }
    async generateCourse(createCourseDto) {
        const generatedCourse = await this.geminiService.generateCourse(createCourseDto);
        return (0, formatResponse_1.formatResponse)(generatedCourse);
    }
    async analyze(createCourseDto) {
        const analysis = `
Course Information Analysis

Title: ${createCourseDto.title}

Description: ${createCourseDto.description}

Category: ${createCourseDto.category}

Level: ${createCourseDto.level}

Duration: ${createCourseDto.duration}

Content Structure

Suggestion: Include specific topics that will be covered in the course, such as:
  - Introduction to Python
  - Data types and variables
  - Control flow (if-else, loops)
  - Functions
  - Object-oriented programming basics

Learning Objectives

Suggestion: Define specific learning outcomes that students should achieve by the end of the course, such as:
  - Understand the basic concepts of programming
  - Be able to write simple Python programs
  - Understand how to use data structures and algorithms
  - Develop problem-solving skills

Teaching Methods

Suggestion: Include a variety of teaching methods to accommodate different learning styles, such as:
  - Lectures
  - Hands-on coding exercises
  - Discussions
  - Quizzes

Assessment Strategies

Suggestion: Use a combination of assessment strategies to evaluate student progress, such as:
  - Weekly assignments
  - Midterm exam
  - Final project
    `;
        return (0, formatResponse_1.formatResponse)(analysis);
    }
    async findAll(req) {
        if (req.user) {
            return this.courseService.findAll(req.user.sub);
        }
        else {
            return this.courseService.findAll();
        }
    }
    async findOne(id) {
        return this.courseService.findOne(id);
    }
    async update(req, id, updateCourseDto) {
        const course = await this.courseService.update(id, updateCourseDto);
        await this.notificationService.notifyCourseCreated(course['_id'], req.user.sub, course.title);
        return course;
    }
    async updateContent(id, updateContentDto) {
        const updatedCourse = await this.courseService.updateContent(id, updateContentDto);
        return (0, formatResponse_1.formatResponse)(updatedCourse);
    }
    async remove(id) {
        return this.courseService.remove(id);
    }
    async getContent(id) {
        const course = await this.courseService.findOne(id);
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        return course;
    }
    async uploadContent(id, file) {
        const fileUrl = `uploads/${file.filename}`;
        const course = await this.courseService.addContent(id, {
            title: file.originalname,
            type: file.mimetype,
            url: fileUrl
        });
        return course;
    }
    async generateContent(body) {
        try {
            const response = await this.geminiService.generateResponse(body.message, '');
            return { response };
        }
        catch (error) {
            console.error('Error generating content:', error);
            throw new Error('Failed to generate content');
        }
    }
};
exports.CourseController = CourseController;
__decorate([
    (0, common_1.Get)(':id/learn'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "learn", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('course-generation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "generateCourse", null);
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "analyze", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "update", null);
__decorate([
    (0, common_1.Put)(':id/content'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/content'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getContent", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
            }
        })
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "uploadContent", null);
__decorate([
    (0, common_1.Post)('generate-content'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "generateContent", null);
exports.CourseController = CourseController = __decorate([
    (0, common_1.Controller)('api/courses'),
    __metadata("design:paramtypes", [course_service_1.CourseService,
        notification_service_1.NotificationService,
        gemini_service_1.GeminiService])
], CourseController);
//# sourceMappingURL=course.controller.js.map