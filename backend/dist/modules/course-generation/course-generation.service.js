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
exports.CourseGenerationService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
let CourseGenerationService = class CourseGenerationService {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generateCourse(subject, level) {
        const prompt = `Create a detailed course structure for ${subject} at ${level} level, including:
        1. Course overview
        2. Learning objectives
        3. Module breakdown
        4. Key topics
        5. Suggested activities
        6. Assessment methods
        Format as JSON with these sections.`;
        return this.aiService.generateStructuredResponse(prompt);
    }
    async generateLearningObjectives(subject, level) {
        const prompt = `Create specific learning objectives for ${subject} at ${level} level, following Bloom's taxonomy.`;
        return this.aiService.generateStructuredResponse(prompt);
    }
    async generateCourseSchedule(subject, level) {
        const prompt = `Create a detailed course schedule for ${subject} at ${level} level, including:
        1. Weekly breakdown
        2. Time allocation
        3. Learning activities
        4. Milestones
        Format as JSON.`;
        return this.aiService.generateStructuredResponse(prompt);
    }
    async generateAssessments(subject, level) {
        const prompt = `Create a comprehensive assessment plan for ${subject} at ${level} level, including:
        1. Quizzes
        2. Assignments
        3. Projects
        4. Evaluation criteria
        Format as JSON.`;
        return this.aiService.generateStructuredResponse(prompt);
    }
    async enhanceCourseContent(content) {
        const prompt = `Enhance this course content with:
        1. Real-world examples
        2. Practice exercises
        3. Additional resources
        4. Discussion topics
        Content: ${content}`;
        return this.aiService.generateStructuredResponse(prompt);
    }
};
exports.CourseGenerationService = CourseGenerationService;
exports.CourseGenerationService = CourseGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AIService])
], CourseGenerationService);
//# sourceMappingURL=course-generation.service.js.map