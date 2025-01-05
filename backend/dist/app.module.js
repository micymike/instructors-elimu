"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const ai_module_1 = require("./ai/ai.module");
const course_module_1 = require("./course/course.module");
const course_generation_module_1 = require("./modules/course-generation.module");
const gemini_service_1 = require("./services/gemini.service");
const notification_module_1 = require("./notification/notification.module");
const zoom_module_1 = require("./zoom/zoom.module");
const settings_module_1 = require("./modules/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            ai_module_1.AIModule,
            course_module_1.CourseModule,
            course_generation_module_1.CourseGenerationModule,
            notification_module_1.NotificationModule,
            zoom_module_1.ZoomModule,
            settings_module_1.SettingsModule,
        ],
        providers: [gemini_service_1.GeminiService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map