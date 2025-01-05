import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CourseLevel } from '../dto/create-course.dto';

export type CourseDocument = Course & Document & { 
  _id: Types.ObjectId; 
};

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  instructor: string;

  @Prop({ required: true, enum: Object.values(CourseLevel) })
  level: CourseLevel;

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

  @Prop()
  category: string;

  @Prop()
  price: number;

  @Prop()
  subject: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }] })
  students: string[];

  @Prop({ type: [{ 
    url: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'document'], required: true },
    uploadedAt: { type: Date, default: Date.now }
  }], default: [] })
  materials: Array<{
    url: string;
    name: string;
    type: 'pdf' | 'video' | 'document';
    uploadedAt: Date;
  }>;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
