import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { Assessment, AssessmentSchema } from './schemas/assessment.schema';
import { AIModule } from '../ai/ai.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Assessment.name, schema: AssessmentSchema },
        ]),
        AIModule
    ],
    controllers: [AssessmentController],
    providers: [AssessmentService],
    exports: [AssessmentService],
})
export class AssessmentModule { } 