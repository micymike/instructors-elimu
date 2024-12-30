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
exports.AIService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
let AIService = class AIService {
    constructor(configService) {
        this.configService = configService;
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async generateStructuredResponse(prompt) {
        const completion = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert education content creator and course designer."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 4000,
        });
        try {
            return JSON.parse(completion.choices[0].message.content);
        }
        catch (error) {
            console.error('Error parsing Groq response:', error);
            return completion.choices[0].message.content;
        }
    }
    async generateQuestions(subject, topic, difficulty, count = 5) {
        const prompt = `Generate ${count} multiple-choice questions about ${subject}, specifically on the topic of ${topic}. 
        The difficulty level should be ${difficulty}. 
        For each question, provide:
        1. The question text
        2. Four possible answers
        3. The correct answer index (0-3)
        Format the response as a JSON array of objects.`;
        const response = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert education content creator specializing in creating assessment questions."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 2000,
        });
        return JSON.parse(response.choices[0].message.content).questions;
    }
    async suggestImprovements(questions) {
        const prompt = `Review these assessment questions and suggest improvements for clarity, difficulty balance, and educational value: ${JSON.stringify(questions)}`;
        const response = await this.groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert in educational assessment design."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
        });
        return response.choices[0].message.content;
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AIService);
//# sourceMappingURL=ai.service.js.map