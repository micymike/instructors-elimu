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
exports.CourseGenerationController = void 0;
const common_1 = require("@nestjs/common");
const course_generation_service_1 = require("./course-generation.service");
let CourseGenerationController = class CourseGenerationController {
    constructor(courseGenerationService) {
        this.courseGenerationService = courseGenerationService;
    }
    async generateCourse(body) {
        switch (body.mode) {
            case 'course':
                return this.courseGenerationService.generateCourse(body.subject, body.level);
            case 'objectives':
                return this.courseGenerationService.generateLearningObjectives(body.subject, body.level);
            case 'schedule':
                return this.courseGenerationService.generateCourseSchedule(body.subject, body.level);
            case 'assessment':
                return this.courseGenerationService.generateAssessments(body.subject, body.level);
            default:
                throw new Error('Invalid generation mode');
        }
    }
    async enhanceCourse(body) {
        return this.courseGenerationService.enhanceCourseContent(body.content);
    }
};
exports.CourseGenerationController = CourseGenerationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseGenerationController.prototype, "generateCourse", null);
__decorate([
    (0, common_1.Post)('enhance'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CourseGenerationController.prototype, "enhanceCourse", null);
exports.CourseGenerationController = CourseGenerationController = __decorate([
    (0, common_1.Controller)('course-generation'),
    __metadata("design:paramtypes", [course_generation_service_1.CourseGenerationService])
], CourseGenerationController);
//# sourceMappingURL=course-generation.controller.js.map