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
exports.CourseWizardDto = exports.AssessmentDto = exports.ResourceDto = exports.ScheduleSessionDto = exports.SyllabusItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const basic_info_dto_1 = require("./basic-info.dto");
class SyllabusItemDto {
}
exports.SyllabusItemDto = SyllabusItemDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SyllabusItemDto.prototype, "week", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyllabusItemDto.prototype, "topic", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyllabusItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SyllabusItemDto.prototype, "activities", void 0);
class ScheduleSessionDto {
}
exports.ScheduleSessionDto = ScheduleSessionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ScheduleSessionDto.prototype, "sessionTitle", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], ScheduleSessionDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ScheduleSessionDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['live', 'recorded']),
    __metadata("design:type", String)
], ScheduleSessionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleSessionDto.prototype, "zoomLink", void 0);
class ResourceDto {
}
exports.ResourceDto = ResourceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResourceDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['document', 'video', 'link', 'other']),
    __metadata("design:type", String)
], ResourceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResourceDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ResourceDto.prototype, "description", void 0);
class AssessmentDto {
}
exports.AssessmentDto = AssessmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessmentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['quiz', 'assignment', 'project', 'exam']),
    __metadata("design:type", String)
], AssessmentDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AssessmentDto.prototype, "totalPoints", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], AssessmentDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AssessmentDto.prototype, "instructions", void 0);
class CourseWizardDto {
}
exports.CourseWizardDto = CourseWizardDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => basic_info_dto_1.BasicInfoDto),
    __metadata("design:type", basic_info_dto_1.BasicInfoDto)
], CourseWizardDto.prototype, "basicInfo", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyllabusItemDto),
    __metadata("design:type", Array)
], CourseWizardDto.prototype, "syllabus", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScheduleSessionDto),
    __metadata("design:type", Array)
], CourseWizardDto.prototype, "schedule", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ResourceDto),
    __metadata("design:type", Array)
], CourseWizardDto.prototype, "resources", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AssessmentDto),
    __metadata("design:type", Array)
], CourseWizardDto.prototype, "assessments", void 0);
//# sourceMappingURL=course-wizard.dto.js.map