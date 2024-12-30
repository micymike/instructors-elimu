import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerationConfig } from '@google/generative-ai';
import { CreateCourseDto } from '../dto/create-course.dto';
import { Observable } from 'rxjs';
interface CourseStructure {
    title: string;
    description: string;
    level: string;
    objectives: string[];
    modules: CourseModule[];
    schedule: CourseSchedule;
    assessments: Assessment[];
    resources: Resource[];
    metadata: CourseMetadata;
}
interface CourseModule {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
    duration: string;
    prerequisites: string[];
}
interface Lesson {
    id: string;
    title: string;
    content: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment';
    duration: string;
    resources: Resource[];
}
interface CourseSchedule {
    totalDuration: string;
    weeklySchedule: WeeklyPlan[];
}
interface WeeklyPlan {
    week: number;
    topics: string[];
    activities: string[];
    assignments: string[];
}
interface Assessment {
    type: 'quiz' | 'assignment' | 'project' | 'exam';
    title: string;
    description: string;
    weight: number;
    rubric?: string[];
}
interface Resource {
    type: 'book' | 'video' | 'article' | 'tool';
    title: string;
    description: string;
    url?: string;
    required: boolean;
}
interface CourseMetadata {
    generatedAt: Date;
    lastUpdated: Date;
    version: string;
    targetAudience: string[];
    prerequisites: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedCompletion: string;
    tags: string[];
}
export declare class GeminiService implements OnModuleInit {
    private configService;
    private model;
    private readonly logger;
    private readonly configDefaults;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    generateResponse(prompt: string, context: string, config?: Partial<GenerationConfig>): Promise<string>;
    generateCourse(createCourseDto: CreateCourseDto): Promise<CourseStructure>;
    private generateBasicStructure;
    private generateDetailedModules;
    private generateAssessments;
    private generateSchedule;
    private generateMetadata;
    private parseDuration;
    private formatDuration;
    private mapLevelToDifficulty;
    private determineTargetAudience;
    private validateModel;
    private validateCourseStructure;
    private formatResponse;
    private handleError;
    generateResponseRx(prompt: string, context: string): Observable<string>;
}
export {};
