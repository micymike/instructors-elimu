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
    async generateResponse(prompt, stage = '') {
        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        }
        catch (error) {
            console.error('Error generating response:', error);
            throw new Error(`Failed to generate ${stage} response`);
        }
    }
    async generateCourse(courseData) {
        const prompt = `Generate a comprehensive course structure for a course with the following details:
      Title: ${courseData.title}
      Description: ${courseData.description}
      Category: ${courseData.category}
      Level: ${courseData.level}
      Duration: ${courseData.duration}

      Please provide a detailed outline including:
      1. Course objectives
      2. Modules/Sections
      3. Learning outcomes
      4. Assessment methods
    `;
        try {
            const result = await this.model.generateContent(prompt);
            return Object.assign({ title: courseData.title, description: result.response.text() }, courseData);
        }
        catch (error) {
            console.error('Error generating course:', error);
            throw new Error('Failed to generate course structure');
        }
    }
    determineStage(context) {
        if (!context || context.length === 0)
            return 'subject';
        const messages = context.map(msg => msg.content.toLowerCase());
        if (!messages.some(msg => msg.includes('subject')))
            return 'subject';
        if (!messages.some(msg => msg.includes('audience')))
            return 'audience';
        if (!messages.some(msg => msg.includes('duration')))
            return 'duration';
        if (!messages.some(msg => msg.includes('objectives')))
            return 'objectives';
        return 'final';
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map