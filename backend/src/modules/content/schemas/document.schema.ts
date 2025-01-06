import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DocumentDocument = HydratedDocument<Document>;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  instructorId: Types.ObjectId;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ required: true })
  publicId: string;

  @Prop()
  plagiarismScore?: number;

  @Prop({ type: Object })
  plagiarismResults?: Record<string, any>;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop()
  description?: string;

  @Prop([String])
  tags?: string[];
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
