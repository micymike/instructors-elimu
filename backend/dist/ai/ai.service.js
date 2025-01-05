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
const gemini_service_1 = require("../services/gemini.service");
const groq_sdk_1 = require("groq-sdk");
let AIService = class AIService {
    constructor(configService, geminiService) {
        this.configService = configService;
        this.geminiService = geminiService;
        this.groq = new groq_sdk_1.default({
            apiKey: this.configService.get('GROQ_API_KEY'),
        });
    }
    async generateStructuredResponse(prompt) {
        try {
            const result = await this.geminiService.generateResponse(prompt, 'course-generation');
            return result;
        }
        catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Failed to generate response');
        }
    }
    async generateMultimodalResponse(prompt, context) {
        const geminiResponse = await this.geminiService.generateResponse(prompt, 'multimodal');
        return geminiResponse;
    }
};
exports.AIService = AIService;
exports.AIService = AIService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        gemini_service_1.GeminiService])
], AIService);
//# sourceMappingURL=ai.service.js.map