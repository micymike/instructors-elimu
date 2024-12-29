import { Injectable } from '@nestjs/common';
import { GeminiService } from '../ai/gemini.service';

export interface CourseWizardFormattedResponse {
  sections: {
    title: string;
    content: string[];
  }[];
}

@Injectable()
export class CourseWizardService {
  constructor(private readonly geminiService: GeminiService) {}

  private formatAIResponse(response: string): CourseWizardFormattedResponse {
    // Split response into sections based on numbered points or headers
    const sections = response.split(/(?=\d+\.|\n[A-Z][^:]+:)/).filter(Boolean);
    
    return {
      sections: sections.map(section => {
        // Extract title and content
        const lines = section.trim().split('\n');
        const title = lines[0].replace(/^\d+\.\s*/, '').replace(/:$/, '').trim();
        
        // Process remaining lines into clean content array
        const content = lines.slice(1)
          .map(line => line.trim())
          .filter(line => 
            line && 
            !line.startsWith('*') && 
            !line.startsWith('-') && 
            !line.startsWith('#')
          )
          .map(line => line.replace(/\*\*/g, '').replace(/\*/g, ''));

        return { title, content };
      })
    };
  }

  async analyzeCourse(basicInfo: any) {
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

  async generateSyllabus(data: any) {
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
}
