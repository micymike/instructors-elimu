import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, GenerationConfig, ModelParams } from '@google/generative-ai';
import { CreateCourseDto } from '../dto/create-course.dto';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Observable, from, throwError, retry, timeout } from 'rxjs';

interface GeminiConfig {
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

interface CourseStructure {
  title: string;
  description: string;
  level: string;
  objectives: string[];
  modules: CourseModule[];
  schedule: CourseSchedule;
  assessments: Assessment[];
  resources: Resource[];
  metadata: CourseMetadata;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  prerequisites: string[];
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: string;
  resources: Resource[];
}

interface CourseSchedule {
  totalDuration: string;
  weeklySchedule: WeeklyPlan[];
}

interface WeeklyPlan {
  week: number;
  topics: string[];
  activities: string[];
  assignments: string[];
}

interface Assessment {
  type: 'quiz' | 'assignment' | 'project' | 'exam';
  title: string;
  description: string;
  weight: number;
  rubric?: string[];
}

interface Resource {
  type: 'book' | 'video' | 'article' | 'tool';
  title: string;
  description: string;
  url?: string;
  required: boolean;
}

interface CourseMetadata {
  generatedAt: Date;
  lastUpdated: Date;
  version: string;
  targetAudience: string[];
  prerequisites: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedCompletion: string;
  tags: string[];
}

@Injectable()
export class GeminiService implements OnModuleInit {
  private model: GenerativeModel;
  private readonly logger = new Logger(GeminiService.name);
private readonly configDefaults: GeminiConfig = {
  model: 'gemini-pro',
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: this.configDefaults.model });
      this.logger.log('Gemini service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Gemini service', error.stack);
      throw error;
    }
  }

  async generateResponse(
    prompt: string, 
    context: string,
    config?: Partial<GenerationConfig>
  ): Promise<string> {
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
    } catch (error) {
      this.handleError('Content generation failed', error);
      throw error;
    }
  }

  async generateCourse(createCourseDto: CreateCourseDto): Promise<CourseStructure> {
    try {
      this.validateModel();
      
      const { subject, level, additionalRequirements } = createCourseDto;
      
      // Generate course structure in multiple steps
      const basicStructure = await this.generateBasicStructure(subject, level);
      const enhancedModules = await this.generateDetailedModules(basicStructure.modules, subject);
      const assessments = await this.generateAssessments(subject, level);
      const schedule = await this.generateSchedule(enhancedModules);
      
      const courseStructure: CourseStructure = {
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

      // Validate the generated content
      this.validateCourseStructure(courseStructure);
      
      return courseStructure;
    } catch (error) {
      this.handleError('Course generation failed', error);
      throw error;
    }
  }

  private async generateBasicStructure(subject: string, level: string): Promise<Partial<CourseStructure>> {
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

  private async generateDetailedModules(basicModules: CourseModule[], subject: string): Promise<CourseModule[]> {
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

  private async generateAssessments(subject: string, level: string): Promise<Assessment[]> {
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

  private async generateSchedule(modules: CourseModule[]): Promise<CourseSchedule> {
    const totalDuration = modules.reduce(
      (acc, module) => acc + this.parseDuration(module.duration),
      0
    );

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

  private generateMetadata(subject: string, level: string): CourseMetadata {
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

  private parseDuration(duration: string): number {
    // Convert duration string to minutes
    const matches = duration.match(/(\d+)\s*(min|hour|day|week)/i);
    if (!matches) return 0;

    const [, value, unit] = matches;
    const multipliers = {
      min: 1,
      hour: 60,
      day: 60 * 24,
      week: 60 * 24 * 7,
    };

    return parseInt(value) * multipliers[unit.toLowerCase()];
  }

  private formatDuration(minutes: number): string {
    const weeks = Math.floor(minutes / (60 * 24 * 7));
    return `${weeks} weeks`;
  }

  private mapLevelToDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
    const mappings = {
      basic: 'beginner',
      intermediate: 'intermediate',
      advanced: 'advanced',
    };
    return mappings[level.toLowerCase()] || 'intermediate';
  }

  private determineTargetAudience(level: string): string[] {
    const audiences = {
      beginner: ['Students new to the subject', 'Career changers', 'Hobbyists'],
      intermediate: ['Students with basic knowledge', 'Professionals', 'College students'],
      advanced: ['Expert practitioners', 'Specialists', 'Research-oriented individuals'],
    };
    return audiences[this.mapLevelToDifficulty(level)];
  }

  private validateModel(): void {
    if (!this.model) {
      throw new Error('Gemini model not initialized');
    }
  }

  private validateCourseStructure(course: CourseStructure): void {
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

private formatResponse(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .trim();
}

  private handleError(message: string, error: any): void {
    this.logger.error(message, error.stack);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please check your API key.');
    }
    
    throw new Error(`Failed to generate content: ${error.message}`);
  }

  // Observable wrapper for reactive programming support
  generateResponseRx(prompt: string, context: string): Observable<string> {
    return from(this.generateResponse(prompt, context)).pipe(
      retry(3),
      timeout(30000)
    );
  }
}
