import { Injectable } from '@nestjs/common';
import { AIService } from '../../ai/ai.service';

@Injectable()
export class CourseGenerationService {
  constructor(private aiService: AIService) { }

  async generateCourse(subject: string, level: string) {
    const prompt = `Create a detailed course structure for ${subject} at ${level} level, including:
        1. Course overview
        2. Learning objectives
        3. Module breakdown
        4. Key topics
        5. Suggested activities
        6. Assessment methods
        Format as JSON with these sections.`;

    return this.aiService.generateStructuredResponse(prompt);
  }

  async generateLearningObjectives(subject: string, level: string) {
    const prompt = `Create specific learning objectives for ${subject} at ${level} level, following Bloom's taxonomy.`;
    return this.aiService.generateStructuredResponse(prompt);
  }

  async generateCourseSchedule(subject: string, level: string) {
    const prompt = `Create a detailed course schedule for ${subject} at ${level} level, including:
        1. Weekly breakdown
        2. Time allocation
        3. Learning activities
        4. Milestones
        Format as JSON.`;

    return this.aiService.generateStructuredResponse(prompt);
  }

  async generateAssessments(subject: string, level: string) {
    const prompt = `Create a comprehensive assessment plan for ${subject} at ${level} level, including:
        1. Quizzes
        2. Assignments
        3. Projects
        4. Evaluation criteria
        Format as JSON.`;

    return this.aiService.generateStructuredResponse(prompt);
  }

  async enhanceCourseContent(content: string) {
    const prompt = `Enhance this course content with:
        1. Real-world examples
        2. Practice exercises
        3. Additional resources
        4. Discussion topics
        Content: ${content}`;

    return this.aiService.generateStructuredResponse(prompt);
  }
} 