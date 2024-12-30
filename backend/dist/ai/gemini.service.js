"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = class GeminiService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    async generateResponse(prompt, context) {
        try {
            if (!this.model) {
                throw new Error('Gemini model not initialized');
            }
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to generate content');
        }
    }
    async generateCourse(createCourseDto) {
        try {
            const prompt = `Generate a detailed course structure for a ${createCourseDto.level} level course on ${createCourseDto.subject}. Include:
        1. Course title
        2. Course description
        3. Learning objectives
        4. Syllabus with modules and lessons
        5. Suggested schedule
        6. Assessment methods
        7. Required resources`;
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            return {
                title: createCourseDto.subject,
                description: text,
                level: createCourseDto.level,
                generated: true,
                content: text,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('Error generating course:', error);
            throw new Error('Failed to generate course content');
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map