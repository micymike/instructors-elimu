import { BasicInfoDto } from './basic-info.dto';
export declare class SyllabusItemDto {
    week: number;
    topic: string;
    description: string;
    activities: string[];
}
export declare class ScheduleSessionDto {
    sessionTitle: string;
    date: Date;
    duration: number;
    type: string;
    zoomLink?: string;
}
export declare class ResourceDto {
    title: string;
    type: string;
    url: string;
    description?: string;
}
export declare class AssessmentDto {
    title: string;
    type: string;
    totalPoints: number;
    dueDate?: Date;
    instructions: string;
}
export declare class CourseWizardDto {
    basicInfo: BasicInfoDto;
    syllabus: SyllabusItemDto[];
    schedule: ScheduleSessionDto[];
    resources: ResourceDto[];
    assessments: AssessmentDto[];
}
