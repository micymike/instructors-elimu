declare class ContentDto {
    type: string;
    title: string;
    description: string;
    url?: string;
    duration?: number;
}
declare class ModuleDto {
    title: string;
    description: string;
    content: ContentDto[];
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    price: number;
    category: string;
    level: string;
    duration: string;
    subject: string;
    syllabus: ModuleDto[];
    tags?: string[];
    additionalRequirements?: string;
}
export declare class UpdateCourseDto {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    tags?: string[];
    thumbnail?: string;
}
export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class CourseQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: SortOrder;
    minRating?: number;
    maxPrice?: number;
    featured?: boolean;
    published?: boolean;
}
export {};
