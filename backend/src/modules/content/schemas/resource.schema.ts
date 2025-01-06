import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Resource extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  level: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', default: null })
  courseId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  fileUrl?: string;

  @Prop({ default: true })
  isFree: boolean;

  @Prop({ default: 'Course Platform' })
  provider: string;

  @Prop()
  description?: string;

  @Prop()
  url?: string;

  @Prop({ default: [] })
  tags?: string[];

  @Prop({ default: 0 })
  rating?: number;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);
