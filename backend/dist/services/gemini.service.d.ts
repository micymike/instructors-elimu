import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
interface ModuleContent {
    type: string;
    title: string;
    description: string;
}
interface CourseModule {
    title: string;
    description: string;
    content: ModuleContent[];
}
interface CourseStructure {
    title: string;
    description: string;
    modules: CourseModule[];
    level: string;
    duration: string;
    category: string;
}
export declare class GeminiService implements OnModuleInit {
    private configService;
    private model;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    generateResponse(message: string, stage: string): Promise<string>;
    generateCourseStructure(context: Array<{
        role: string;
        content: string;
    }>): Promise<CourseStructure>;
    generateCourse(createCourseDto: any): Promise<any>;
    private validateCourseStructure;
    determineStage(context: Array<{
        role: string;
        content: string;
    }>): "subject" | "audience" | "objectives" | "duration" | "final";
}
export {};
