import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserSettingsDocument = UserSettings & Document;

@Schema()
export class UserSettings {
  @Prop()
  profileImage: string;

  @Prop()
  displayName: string;

  @Prop()
  bio: string;

  @Prop()
  profileVisibility: string;

  @Prop()
  showRatings: boolean;

  @Prop()
  emailNotifications: boolean;

  @Prop()
  courseUpdates: boolean;

  @Prop()
  studentMessages: boolean;

  @Prop()
  marketingEmails: boolean;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
