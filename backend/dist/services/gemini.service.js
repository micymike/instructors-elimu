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
    async generateResponse(message, stage) {
        try {
            let prompt = '';
            switch (stage) {
                case 'subject':
                    prompt = `You are a course creation assistant. The user wants to create a course about: "${message}".
                   Ask them about their target audience and experience level.`;
                    break;
                case 'audience':
                    prompt = `Based on the target audience: "${message}",
                   Ask about specific learning objectives they want to achieve.`;
                    break;
                case 'objectives':
                    prompt = `Given these learning objectives: "${message}",
                   Ask about the preferred course duration and time commitment.`;
                    break;
                case 'duration':
                    prompt = `With the duration being: "${message}",
                   Let them know you'll generate a course structure now.`;
                    break;
                case 'final':
                    return "Great! I'll now generate a detailed course structure for you.";
            }
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
    async generateCourseStructure(context) {
        try {
            const userInputs = context
                .filter(msg => msg.role === 'user')
                .map(msg => msg.content);
            const [subject, audience, objectives, duration] = userInputs;
            const prompt = `
        Create a detailed course structure based on this information:
        Subject: ${subject}
        Target Audience: ${audience}
        Learning Objectives: ${objectives}
        Duration: ${duration}
        // ... rest of your prompt ...
      `;
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const cleanedResponse = response
                .replace(/```json\s*/g, '')
                .replace(/```\s*$/g, '')
                .replace(/[\u201C\u201D]/g, '"')
                .trim();
            const parsedData = JSON.parse(cleanedResponse);
            if (!this.validateCourseStructure(parsedData)) {
                throw new Error('Generated course structure is invalid');
            }
            return parsedData;
        }
        catch (error) {
            console.error('Course generation error:', error);
            throw new Error('Failed to generate course structure');
        }
    }
    async generateCourse(createCourseDto) {
        return { message: 'Course generated successfully' };
    }
    validateCourseStructure(data) {
        try {
            if (!data || typeof data !== 'object')
                return false;
            const requiredFields = ['title', 'description', 'modules', 'level', 'duration', 'category'];
            if (!requiredFields.every(field => field in data))
                return false;
            if (typeof data.title !== 'string' ||
                typeof data.description !== 'string' ||
                !Array.isArray(data.modules) ||
                typeof data.level !== 'string' ||
                typeof data.duration !== 'string' ||
                typeof data.category !== 'string') {
                return false;
            }
            return data.modules.every((module) => typeof module.title === 'string' &&
                typeof module.description === 'string' &&
                Array.isArray(module.content) &&
                module.content.every((content) => typeof content.type === 'string' &&
                    ['video', 'document', 'quiz', 'assignment'].includes(content.type) &&
                    typeof content.title === 'string' &&
                    typeof content.description === 'string'));
        }
        catch (error) {
            console.error('Validation error:', error);
            return false;
        }
    }
    determineStage(context) {
        if (!context || !Array.isArray(context)) {
            return 'subject';
        }
        const messages = context.map(msg => msg.content.toLowerCase());
        if (!messages.some(msg => msg.includes('subject')))
            return 'subject';
        if (!messages.some(msg => msg.includes('audience')))
            return 'audience';
        if (!messages.some(msg => msg.includes('objectives')))
            return 'objectives';
        if (!messages.some(msg => msg.includes('duration')))
            return 'duration';
        return 'final';
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map