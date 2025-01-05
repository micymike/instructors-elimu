"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const instructor_controller_1 = require("../../controllers/instructor.controller");
const instructor_service_1 = require("../../services/instructor.service");
const instructor_entity_1 = require("../../instructor/instructor.entity");
const auth_module_1 = require("../../auth/auth.module");
const s3_service_1 = require("../../services/s3.service");
let InstructorModule = class InstructorModule {
};
exports.InstructorModule = InstructorModule;
exports.InstructorModule = InstructorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([instructor_entity_1.Instructor]),
            auth_module_1.AuthModule,
        ],
        controllers: [instructor_controller_1.InstructorController],
        providers: [instructor_service_1.InstructorService, s3_service_1.S3Service],
        exports: [instructor_service_1.InstructorService],
    })
], InstructorModule);
//# sourceMappingURL=instructor.module.js.map