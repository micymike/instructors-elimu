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
exports.AssessmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const assessment_schema_1 = require("./schemas/assessment.schema");
const ai_service_1 = require("../ai/ai.service");
let AssessmentService = class AssessmentService {
    constructor(assessmentModel, aiService) {
        this.assessmentModel = assessmentModel;
        this.aiService = aiService;
    }
    async create(createAssessmentDto, instructorId) {
        if (createAssessmentDto.useAI) {
            const aiQuestions = await this.aiService.generateQuestions(createAssessmentDto.subject, createAssessmentDto.topic, createAssessmentDto.difficulty);
            createAssessmentDto.questions = aiQuestions;
        }
        const aiSuggestions = await this.aiService.suggestImprovements(createAssessmentDto.questions);
        const assessment = new this.assessmentModel(Object.assign(Object.assign({}, createAssessmentDto), { instructor: instructorId, aiSuggestions }));
        return assessment.save();
    }
    async findAll(instructorId) {
        return this.assessmentModel.find({ instructor: instructorId }).exec();
    }
    async findOne(id) {
        const assessment = await this.assessmentModel.findById(id).exec();
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }
    async update(id, updateAssessmentDto) {
        const assessment = await this.assessmentModel
            .findByIdAndUpdate(id, updateAssessmentDto, { new: true })
            .exec();
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }
    async delete(id) {
        const assessment = await this.assessmentModel.findByIdAndDelete(id).exec();
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }
    async generateMoreQuestions(id, count) {
        const assessment = await this.findOne(id);
        const newQuestions = await this.aiService.generateQuestions(assessment.subject, assessment.topic, assessment.difficulty, count);
        return newQuestions;
    }
};
exports.AssessmentService = AssessmentService;
exports.AssessmentService = AssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(assessment_schema_1.Assessment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        ai_service_1.AIService])
], AssessmentService);
//# sourceMappingURL=assessment.service.js.map