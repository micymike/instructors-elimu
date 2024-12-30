import { Model } from 'mongoose';
import { AssessmentDocument } from './schemas/assessment.schema';
import { AIService } from '../ai/ai.service';
export declare class AssessmentService {
    private assessmentModel;
    private aiService;
    constructor(assessmentModel: Model<AssessmentDocument>, aiService: AIService);
    create(createAssessmentDto: any, instructorId: string): Promise<AssessmentDocument>;
    findAll(instructorId: string): Promise<AssessmentDocument[]>;
    findOne(id: string): Promise<AssessmentDocument>;
    update(id: string, updateAssessmentDto: any): Promise<AssessmentDocument>;
    delete(id: string): Promise<AssessmentDocument>;
    generateMoreQuestions(id: string, count: number): Promise<any[]>;
}
