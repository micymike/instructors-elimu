"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseGenerationModule = void 0;
const common_1 = require("@nestjs/common");
const course_generation_service_1 = require("./course-generation.service");
const course_controller_1 = require("../../controllers/course.controller");
const mongoose_1 = require("@nestjs/mongoose");
const course_schema_1 = require("../../schemas/course.schema");
const config_1 = require("@nestjs/config");
const ai_module_1 = require("../../ai/ai.module");
const ai_service_1 = require("../../ai/ai.service");
const gemini_service_1 = require("../../services/gemini.service");
const course_service_1 = require("../../services/course.service");
const notification_service_1 = require("../../notification/notification.service");
const notification_module_1 = require("../../notification/notification.module");
const course_module_1 = require("../../course/course.module");
let CourseGenerationModule = class CourseGenerationModule {
};
exports.CourseGenerationModule = CourseGenerationModule;
exports.CourseGenerationModule = CourseGenerationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([{ name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }]),
            course_module_1.CourseModule,
            notification_module_1.NotificationModule,
            ai_module_1.AIModule
        ],
        controllers: [course_controller_1.CourseController],
        providers: [
            course_generation_service_1.CourseGenerationService,
            ai_service_1.AIService,
            gemini_service_1.GeminiService,
            course_service_1.CourseService,
            notification_service_1.NotificationService
        ],
        exports: [course_generation_service_1.CourseGenerationService],
    })
], CourseGenerationModule);
//# sourceMappingURL=course-generation.module.js.map