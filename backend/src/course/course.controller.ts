import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseWizardService, CourseWizardFormattedResponse } from './course-wizard.service';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly courseWizardService: CourseWizardService
  ) { }

  @Post('analyze')
  async analyzeCourse(@Body() basicInfo: any): Promise<CourseWizardFormattedResponse> {
    return this.courseWizardService.analyzeCourse(basicInfo);
  }

  @Post('generate-syllabus')
  async generateSyllabus(@Body() data: any): Promise<CourseWizardFormattedResponse> {
    return this.courseWizardService.generateSyllabus(data);
  }

  @Post()
  async createCourse(@Body() courseData: any) {
    return this.courseService.create(courseData);
  }

  @Get()
  async getAllCourses() {
    return this.courseService.findAll();
  }

  @Get(':id')
  async getCourse(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
}
