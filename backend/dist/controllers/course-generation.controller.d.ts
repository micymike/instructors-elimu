import { JwtService } from '@nestjs/jwt';
import { GeminiService } from '../services/gemini.service';
interface GenerateRequestDto {
    message: string;
    context: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    access_token: string;
}
export declare class CourseGenerationController {
    private readonly geminiService;
    private readonly jwtService;
    constructor(geminiService: GeminiService, jwtService: JwtService);
    generateCourse(body: GenerateRequestDto): Promise<any>;
}
export {};
