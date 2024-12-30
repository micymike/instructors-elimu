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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const rxjs_1 = require("rxjs");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.configDefaults = {
            model: 'gemini-pro',
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        };
    }
    async onModuleInit() {
        try {
            const apiKey = this.configService.get('GEMINI_API_KEY');
            if (!apiKey) {
                throw new Error('GEMINI_API_KEY is not defined');
            }
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.model = genAI.getGenerativeModel({ model: this.configDefaults.model });
            this.logger.log('Gemini service initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize Gemini service', error.stack);
            throw error;
        }
    }
    async generateResponse(prompt, context, config) {
        try {
            this.validateModel();
            const generationConfig = {
                temperature: this.configDefaults.temperature,
                topK: this.configDefaults.topK,
                topP: this.configDefaults.topP,
                maxOutputTokens: this.configDefaults.maxOutputTokens,
                ...config,
            };
            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: `${context}\n\n${prompt}` }] }],
                generationConfig,
            });
            const response = await result.response;
            const text = this.formatResponse(response.text());
            return text;
        }
        catch (error) {
            this.handleError('Content generation failed', error);
            throw error;
        }
    }
    async generateCourse(createCourseDto) {
        try {
            this.validateModel();
            const { subject, level, additionalRequirements } = createCourseDto;
            const basicStructure = await this.generateBasicStructure(subject, level);
            const enhancedModules = await this.generateDetailedModules(basicStructure.modules, subject);
            const assessments = await this.generateAssessments(subject, level);
            const schedule = await this.generateSchedule(enhancedModules);
            const courseStructure = {
                title: basicStructure.title,
                description: basicStructure.description,
                level: basicStructure.level,
                objectives: basicStructure.objectives,
                modules: enhancedModules,
                schedule,
                assessments,
                resources: basicStructure.resources || [],
                metadata: this.generateMetadata(subject, level),
            };
            this.validateCourseStructure(courseStructure);
            return courseStructure;
        }
        catch (error) {
            this.handleError('Course generation failed', error);
            throw error;
        }
    }
    async generateBasicStructure(subject, level) {
        const prompt = `
      Create a comprehensive course structure for a ${level} level course on ${subject}.
      Include:
      1. Course title
      2. Course description
      3. Learning objectives (minimum 5)
      4. Basic module outline
      
      Format the response in JSON.
    `;
        const response = await this.generateResponse(prompt, '');
        return JSON.parse(response);
    }
    async generateDetailedModules(basicModules, subject) {
        const enhancedModules = [];
        for (const module of basicModules) {
            const prompt = `
        Create detailed lessons for the module "${module.title}" in ${subject} course.
        For each lesson include:
        1. Detailed content
        2. Learning activities
        3. Resources
        4. Duration
        
        Format the response in JSON.
      `;
            const response = await this.generateResponse(prompt, '');
            const detailedModule = {
                ...module,
                ...JSON.parse(response),
            };
            enhancedModules.push(detailedModule);
        }
        return enhancedModules;
    }
    async generateAssessments(subject, level) {
        const prompt = `
      Create a comprehensive assessment plan for a ${level} level course on ${subject}.
      Include various assessment types:
      1. Quizzes
      2. Assignments
      3. Projects
      4. Final examination
      
      Format the response in JSON.
    `;
        const response = await this.generateResponse(prompt, '');
        return JSON.parse(response);
    }
    async generateSchedule(modules) {
        const totalDuration = modules.reduce((acc, module) => acc + this.parseDuration(module.duration), 0);
        const weeklyPlans = modules.map((module, index) => ({
            week: index + 1,
            topics: module.lessons.map(lesson => lesson.title),
            activities: module.lessons.map(lesson => `${lesson.type}: ${lesson.title}`),
            assignments: module.lessons
                .filter(lesson => lesson.type === 'assignment')
                .map(lesson => lesson.title),
        }));
        return {
            totalDuration: this.formatDuration(totalDuration),
            weeklySchedule: weeklyPlans,
        };
    }
    generateMetadata(subject, level) {
        return {
            generatedAt: new Date(),
            lastUpdated: new Date(),
            version: '1.0.0',
            targetAudience: this.determineTargetAudience(level),
            prerequisites: [],
            difficulty: this.mapLevelToDifficulty(level),
            estimatedCompletion: '12 weeks',
            tags: [subject, level, 'online course'],
        };
    }
    parseDuration(duration) {
        const matches = duration.match(/(\d+)\s*(min|hour|day|week)/i);
        if (!matches)
            return 0;
        const [, value, unit] = matches;
        const multipliers = {
            min: 1,
            hour: 60,
            day: 60 * 24,
            week: 60 * 24 * 7,
        };
        return parseInt(value) * multipliers[unit.toLowerCase()];
    }
    formatDuration(minutes) {
        const weeks = Math.floor(minutes / (60 * 24 * 7));
        return `${weeks} weeks`;
    }
    mapLevelToDifficulty(level) {
        const mappings = {
            basic: 'beginner',
            intermediate: 'intermediate',
            advanced: 'advanced',
        };
        return mappings[level.toLowerCase()] || 'intermediate';
    }
    determineTargetAudience(level) {
        const audiences = {
            beginner: ['Students new to the subject', 'Career changers', 'Hobbyists'],
            intermediate: ['Students with basic knowledge', 'Professionals', 'College students'],
            advanced: ['Expert practitioners', 'Specialists', 'Research-oriented individuals'],
        };
        return audiences[this.mapLevelToDifficulty(level)];
    }
    validateModel() {
        if (!this.model) {
            throw new Error('Gemini model not initialized');
        }
    }
    validateCourseStructure(course) {
        const requiredFields = [
            'title',
            'description',
            'objectives',
            'modules',
            'schedule',
            'assessments',
        ];
        for (const field of requiredFields) {
            if (!course[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        if (course.modules.length === 0) {
            throw new Error('Course must have at least one module');
        }
    }
    formatResponse(text) {
        return text
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .trim();
    }
    handleError(message, error) {
        this.logger.error(message, error.stack);
        if (error.response?.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.status === 401) {
            throw new Error('Authentication failed. Please check your API key.');
        }
        throw new Error(`Failed to generate content: ${error.message}`);
    }
    generateResponseRx(prompt, context) {
        return (0, rxjs_1.from)(this.generateResponse(prompt, context)).pipe((0, rxjs_1.retry)(3), (0, rxjs_1.timeout)(30000));
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map