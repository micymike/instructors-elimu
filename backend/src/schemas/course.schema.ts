import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Instructor', required: true })
  instructor: string;

  @Prop([{
    title: String,
    description: String,
    content: [{
      type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment'],
      },
      title: String,
      description: String,
      url: String,
      duration: Number,
    }]
  }])
  modules: Array<{
    title: string;
    description: string;
    content: Array<{
      type: string;
      title: string;
      description: string;
      url?: string;
      duration?: number;
    }>;
  }>;

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'] })
  status: string;

  @Prop()
  thumbnail: string;

  @Prop()
  duration: string;

  @Prop({ default: 'beginner', enum: ['beginner', 'intermediate', 'advanced'] })
  level: string;

  @Prop()
  category: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }] })
  students: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course); 