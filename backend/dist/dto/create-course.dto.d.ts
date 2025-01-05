export declare enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    level: CourseLevel;
    category: string;
    topics?: string[];
    resources?: string[];
    instructor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
