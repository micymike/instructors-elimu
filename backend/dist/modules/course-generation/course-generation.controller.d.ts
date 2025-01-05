import { JwtService } from '@nestjs/jwt';
import { GeminiService } from '../../services/gemini.service';
export declare class CourseGenerationController {
    private readonly jwtService;
    private readonly geminiService;
    constructor(jwtService: JwtService, geminiService: GeminiService);
    generateCourse(body: {
        message: string;
        context: any[];
        access_token: string;
    }): Promise<any>;
}
