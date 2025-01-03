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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("./schemas/course.schema");
const gemini_service_1 = require("../ai/gemini.service");
let CourseService = class CourseService {
    constructor(courseModel, geminiService) {
        this.courseModel = courseModel;
        this.geminiService = geminiService;
    }
    async create(createCourseDto) {
        const courseData = typeof createCourseDto.courseData === 'string'
            ? JSON.parse(createCourseDto.courseData)
            : createCourseDto.courseData;
        if (!courseData) {
            throw new common_1.BadRequestException('Course data is required');
        }
        const course = new this.courseModel(courseData);
        return course.save();
    }
    async findAll() {
        return this.courseModel.find().exec();
    }
    async findOne(id) {
        const course = await this.courseModel.findById(id).exec();
        if (!course) {
            throw new common_1.NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }
    async generateLearningObjectives(subject, level) {
        const prompt = `Create specific learning objectives for ${subject} at ${level} level, following Bloom's taxonomy.`;
        return this.geminiService.generateResponse(prompt, 'objectives');
    }
    async generateCourseSchedule(subject, level) {
        const prompt = `Create a detailed course schedule for ${subject} at ${level} level.`;
        return this.geminiService.generateResponse(prompt, 'schedule');
    }
    async generateAssessments(subject, level) {
        const prompt = `Create comprehensive assessment plan for ${subject} at ${level} level.`;
        return this.geminiService.generateResponse(prompt, 'assessments');
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        gemini_service_1.GeminiService])
], CourseService);
//# sourceMappingURL=course.service.js.map