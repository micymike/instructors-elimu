import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Option {
    @Prop({ required: true })
    text: string;
}

@Schema()
class Question {
    @Prop({ required: true })
    question: string;

    @Prop({ type: [String], required: true })
    options: string[];

    @Prop({ required: true })
    correctAnswer: number;
}

@Schema({ timestamps: true })
export class Assessment {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    subject: string;

    @Prop({ required: true })
    topic: string;

    @Prop({ required: true })
    difficulty: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    instructor: string;

    @Prop({ type: [Question], required: true })
    questions: Question[];

    @Prop({ default: 'draft', enum: ['draft', 'published'] })
    status: string;

    @Prop()
    aiSuggestions: string;
}

export type AssessmentDocument = Assessment & Document;
export const AssessmentSchema = SchemaFactory.createForClass(Assessment); 