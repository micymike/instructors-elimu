import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserPDF extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ type: Types.ObjectId, required: true })
  fileId: Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  uploadDate: Date;

  @Prop({ type: Object })
  metadata: {
    originalName: string;
    encoding: string;
    mimeType: string;
  };

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserPDFSchema = SchemaFactory.createForClass(UserPDF);
