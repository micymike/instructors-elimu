import { Controller, Post, Body } from '@nestjs/common';
import { CourseGenerationService } from './course-generation.service';

@Controller('course-generation')
export class CourseGenerationController {
    constructor(private readonly courseGenerationService: CourseGenerationService) { }

    @Post()
    async generateCourse(@Body() body: { mode: string; subject: string; level: string }) {
        switch (body.mode) {
            case 'course':
                return this.courseGenerationService.generateCourse(body.subject, body.level);
            case 'objectives':
                return this.courseGenerationService.generateLearningObjectives(body.subject, body.level);
            case 'schedule':
                return this.courseGenerationService.generateCourseSchedule(body.subject, body.level);
            case 'assessment':
                return this.courseGenerationService.generateAssessments(body.subject, body.level);
            default:
                throw new Error('Invalid generation mode');
        }
    }

    @Post('enhance')
    async enhanceCourse(@Body() body: { content: string }) {
        return this.courseGenerationService.enhanceCourseContent(body.content);
    }
} 