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
const config_1 = require("@nestjs/config");
const course_generation_controller_1 = require("../../controllers/course-generation.controller");
const course_generation_service_1 = require("./course-generation.service");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../../auth/auth.module");
const ai_module_1 = require("../../ai/ai.module");
const ai_service_1 = require("../../ai/ai.service");
const gemini_service_1 = require("../../services/gemini.service");
let CourseGenerationModule = class CourseGenerationModule {
};
exports.CourseGenerationModule = CourseGenerationModule;
exports.CourseGenerationModule = CourseGenerationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            auth_module_1.AuthModule,
            ai_module_1.AIModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [course_generation_controller_1.CourseGenerationController],
        providers: [course_generation_service_1.CourseGenerationService, ai_service_1.AIService, gemini_service_1.GeminiService],
        exports: [course_generation_service_1.CourseGenerationService],
    })
], CourseGenerationModule);
//# sourceMappingURL=course-generation.module.js.map