import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseContentDocument = CourseContent & Document;

@Schema({ timestamps: true })
export class CourseContent {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  moduleIndex: number;

  @Prop({ required: true })
  contentIndex: number;

  @Prop({ required: false })
  videoUrl?: string;

  @Prop({ required: false })
  pdfUrl?: string;

  @Prop({ type: [String], default: [] })
  materials: string[];

  @Prop({ type: [String], default: [] })
  prerequisites: string[];
}

export const CourseContentSchema = SchemaFactory.createForClass(CourseContent);