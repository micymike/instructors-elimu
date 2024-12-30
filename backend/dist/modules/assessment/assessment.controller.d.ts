import { AssessmentService } from './assessment.service';
export declare class AssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: AssessmentService);
    create(createAssessmentDto: any, req: any): Promise<import("./schemas/assessment.schema").AssessmentDocument>;
    generateMoreQuestions(id: string, count: number): Promise<any[]>;
    findAll(req: any): Promise<import("./schemas/assessment.schema").AssessmentDocument[]>;
    findOne(id: string): Promise<import("./schemas/assessment.schema").AssessmentDocument>;
    update(id: string, updateAssessmentDto: any): Promise<import("./schemas/assessment.schema").AssessmentDocument>;
    delete(id: string): Promise<import("./schemas/assessment.schema").AssessmentDocument>;
}
