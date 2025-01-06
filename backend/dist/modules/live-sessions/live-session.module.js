"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const live_session_service_1 = require("./live-session.service");
const live_session_controller_1 = require("./live-session.controller");
const zoom_module_1 = require("../../zoom/zoom.module");
const course_schema_1 = require("../../schemas/course.schema");
let LiveSessionModule = class LiveSessionModule {
};
exports.LiveSessionModule = LiveSessionModule;
exports.LiveSessionModule = LiveSessionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema }]),
            zoom_module_1.ZoomModule
        ],
        controllers: [live_session_controller_1.LiveSessionController],
        providers: [live_session_service_1.LiveSessionService],
        exports: [live_session_service_1.LiveSessionService]
    })
], LiveSessionModule);
//# sourceMappingURL=live-session.module.js.map