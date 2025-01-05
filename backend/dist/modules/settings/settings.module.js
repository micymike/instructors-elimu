"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const settings_controller_1 = require("./settings.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_settings_schema_1 = require("../../schemas/user-settings.schema");
const user_service_1 = require("../../services/user.service");
const instructor_module_1 = require("../../interceptors/instructor.module");
let SettingsModule = class SettingsModule {
};
exports.SettingsModule = SettingsModule;
exports.SettingsModule = SettingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_settings_schema_1.UserSettings.name, schema: user_settings_schema_1.UserSettingsSchema }]),
            instructor_module_1.InstructorModule,
        ],
        providers: [settings_service_1.SettingsService, user_service_1.UserService],
        controllers: [settings_controller_1.SettingsController],
    })
], SettingsModule);
//# sourceMappingURL=settings.module.js.map