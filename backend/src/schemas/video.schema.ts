import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export interface VideoResponse extends Video {
  id: string;
}

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  cloudinaryId: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  duration: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  instructor: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'private', enum: ['private', 'public', 'unlisted'] })
  visibility: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Course' }] })
  courses: MongooseSchema.Types.ObjectId[];

  @Prop()
  transcription: string;

  @Prop()
  captions: string;

  @Prop()
  quality: string;

  @Prop()
  size: number;

  @Prop()
  format: string;

  @Prop({ default: false })
  isProcessed: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
