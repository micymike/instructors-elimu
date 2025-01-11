export declare enum CourseLevel {
    BEGINNER = "Beginner",
    INTERMEDIATE = "Intermediate",
    ADVANCED = "Advanced"
}
export declare class InstructorDto {
    id: string;
    name: string;
    email: string;
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    instructor: InstructorDto;
    level: CourseLevel;
    category?: string;
    topics?: string[];
    resources?: string[];
    price?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
