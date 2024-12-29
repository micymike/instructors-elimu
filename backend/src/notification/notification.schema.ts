import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  })
  type: string;

  @Prop({
    type: String,
    enum: ['course', 'enrollment', 'review', 'system'],
    required: true,
  })
  category: string;

  @Prop({ type: Object })
  metadata: {
    courseId?: string;
    studentId?: string;
    instructorId?: string;
    actionUrl?: string;
  };

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: true })
  active: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
