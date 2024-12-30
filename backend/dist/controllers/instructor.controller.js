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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const s3_service_1 = require("../services/s3.service");
const instructor_service_1 = require("../services/instructor.service");
const update_instructor_dto_1 = require("../dto/update-instructor.dto");
let InstructorController = class InstructorController {
    constructor(s3Service, instructorService) {
        this.s3Service = s3Service;
        this.instructorService = instructorService;
    }
    async uploadProfilePicture(file, req) {
        try {
            const url = await this.s3Service.uploadProfilePicture(file, req.user.sub);
            await this.instructorService.updateProfilePicture(req.user.sub, url);
            return { url };
        }
        catch (error) {
            throw new Error('Failed to upload profile picture');
        }
    }
    async findAll() {
        return this.instructorService.findAll();
    }
    async findOne(id) {
        return this.instructorService.findOne(id);
    }
    async update(id, updateInstructorDto) {
        return this.instructorService.update(id, updateInstructorDto);
    }
    async remove(id) {
        return this.instructorService.remove(id);
    }
    async getDashboardStats(req) {
        try {
            const stats = await this.instructorService.getDashboardStats(req.user.sub);
            return stats;
        }
        catch (error) {
            throw new Error('Failed to retrieve dashboard stats');
        }
    }
};
exports.InstructorController = InstructorController;
__decorate([
    (0, common_1.Post)('profile-picture'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof common_1.UploadedFile !== "undefined" && common_1.UploadedFile) === "function" ? _a : Object, Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstructorController.prototype, "getDashboardStats", null);
exports.InstructorController = InstructorController = __decorate([
    (0, common_1.Controller)('instructors'),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        instructor_service_1.InstructorService])
], InstructorController);
//# sourceMappingURL=instructor.controller.js.map