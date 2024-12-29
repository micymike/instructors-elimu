import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Request,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';

@Controller('assessments')
export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) { }

    @Post()
    async create(@Body() createAssessmentDto: any, @Request() req) {
        return this.assessmentService.create(createAssessmentDto, req.user.id);
    }

    @Post(':id/generate-more')
    async generateMoreQuestions(
        @Param('id') id: string,
        @Body('count') count: number
    ) {
        return this.assessmentService.generateMoreQuestions(id, count);
    }

    @Get()
    async findAll(@Request() req) {
        return this.assessmentService.findAll(req.user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.assessmentService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateAssessmentDto: any) {
        return this.assessmentService.update(id, updateAssessmentDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.assessmentService.delete(id);
    }
} 