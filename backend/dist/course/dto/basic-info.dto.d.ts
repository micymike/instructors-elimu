export declare class CurriculumDto {
    system: string;
    subject: string;
    level: string;
    subjectLevel: string;
    examBoard: string;
}
export declare class BasicInfoDto {
    title: string;
    description: string;
    curriculum: CurriculumDto;
    language: string;
    duration: string;
    prerequisites: string;
    objectives: string;
}
