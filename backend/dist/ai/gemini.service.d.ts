import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCourseDto } from '../dto/create-course.dto';
export declare class GeminiService implements OnModuleInit {
    private configService;
    private model;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    generateResponse(prompt: string, context: string): Promise<any>;
    generateCourse(createCourseDto: CreateCourseDto): Promise<{
        title: string;
        description: any;
        level: string;
        generated: boolean;
        content: any;
        timestamp: string;
    }>;
}
