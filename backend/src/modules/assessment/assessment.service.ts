import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assessment, AssessmentDocument } from './schemas/assessment.schema';
import { AIService } from '../ai/ai.service';

@Injectable()
export class AssessmentService {
    constructor(
        @InjectModel(Assessment.name) private assessmentModel: Model<AssessmentDocument>,
        private aiService: AIService
    ) { }

    async create(createAssessmentDto: any, instructorId: string): Promise<AssessmentDocument> {
        // Generate AI questions if requested
        if (createAssessmentDto.useAI) {
            const aiQuestions = await this.aiService.generateQuestions(
                createAssessmentDto.subject,
                createAssessmentDto.topic,
                createAssessmentDto.difficulty
            );
            createAssessmentDto.questions = aiQuestions;
        }

        // Get AI suggestions for the questions
        const aiSuggestions = await this.aiService.suggestImprovements(createAssessmentDto.questions);

        const assessment = new this.assessmentModel({
            ...createAssessmentDto,
            instructor: instructorId,
            aiSuggestions
        });

        return assessment.save();
    }

    async findAll(instructorId: string): Promise<AssessmentDocument[]> {
        return this.assessmentModel.find({ instructor: instructorId }).exec();
    }

    async findOne(id: string): Promise<AssessmentDocument> {
        const assessment = await this.assessmentModel.findById(id).exec();
        if (!assessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }

    async update(id: string, updateAssessmentDto: any): Promise<AssessmentDocument> {
        const assessment = await this.assessmentModel
            .findByIdAndUpdate(id, updateAssessmentDto, { new: true })
            .exec();
        if (!assessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }

    async delete(id: string): Promise<AssessmentDocument> {
        const assessment = await this.assessmentModel.findByIdAndDelete(id).exec();
        if (!assessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }
        return assessment;
    }

    async generateMoreQuestions(id: string, count: number): Promise<any[]> {
        const assessment = await this.findOne(id);
        const newQuestions = await this.aiService.generateQuestions(
            assessment.subject,
            assessment.topic,
            assessment.difficulty,
            count
        );
        return newQuestions;
    }
} 