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
exports.CourseWizardService = void 0;
const common_1 = require("@nestjs/common");
const gemini_service_1 = require("../ai/gemini.service");
let CourseWizardService = class CourseWizardService {
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    formatAIResponse(response) {
        const sections = response.split(/(?=\d+\.|\n[A-Z][^:]+:)/).filter(Boolean);
        return {
            sections: sections.map(section => {
                const lines = section.trim().split('\n');
                const title = lines[0].replace(/^\d+\.\s*/, '').replace(/:$/, '').trim();
                const content = lines.slice(1)
                    .map(line => line.trim())
                    .filter(line => line &&
                    !line.startsWith('*') &&
                    !line.startsWith('-') &&
                    !line.startsWith('#'))
                    .map(line => line.replace(/\*\*/g, '').replace(/\*/g, ''));
                return { title, content };
            })
        };
    }
    async analyzeCourse(basicInfo) {
        const prompt = `Analyze this course information and suggest improvements:
      Title: ${basicInfo.title}
      Description: ${basicInfo.description}
      Category: ${basicInfo.category}
      Level: ${basicInfo.level}
      Duration: ${basicInfo.duration}
      Provide suggestions for:
      1. Content structure
      2. Learning objectives
      3. Teaching methods
      4. Assessment strategies`;
        const response = await this.geminiService.generateResponse(prompt, 'analysis');
        return this.formatAIResponse(response);
    }
    async generateSyllabus(data) {
        const prompt = `Create a detailed syllabus for:
      Title: ${data.basicInfo.title}
      Level: ${data.basicInfo.level}
      Category: ${data.basicInfo.category}
      Include:
      1. Course objectives
      2. Weekly modules
      3. Learning activities
      4. Assessment methods`;
        const response = await this.geminiService.generateResponse(prompt, 'syllabus');
        return this.formatAIResponse(response);
    }
};
exports.CourseWizardService = CourseWizardService;
exports.CourseWizardService = CourseWizardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService])
], CourseWizardService);
//# sourceMappingURL=course-wizard.service.js.map