import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class GeminiService implements OnModuleInit {
    private configService;
    private model;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    generateResponse(prompt: string, stage?: string): Promise<string>;
    generateCourse(courseData: any): Promise<any>;
    determineStage(context: any[]): string;
}
