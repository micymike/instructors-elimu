import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
class CourseItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['video', 'document', 'quiz'] })
  type: string;

  @Prop()
  content?: string;

  @Prop()
  url?: string;
}

@Schema()
class CourseSection {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [CourseItem] })
  items: CourseItem[];
}

@Schema()
class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Object })
  completedItems: { [key: string]: boolean };

  @Prop()
  lastAccessed: Date;
}

@Schema()
class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

@Schema()
class Analytics {
  @Prop({ default: 0 })
  enrollments: number;

  @Prop({ default: 0 })
  completionRate: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  revenue: number;

  @Prop({ default: 0 })
  activeStudents: number;
}

@Schema()
class Pricing {
  @Prop({ required: true, default: 0 })
  amount: number;

  @Prop({ required: true, default: 'USD' })
  currency: string;
}

@Schema()
class Content {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: ['video', 'document', 'quiz', 'external'] })
  type: string;

  @Prop()
  url?: string;

  @Prop()
  content?: string;

  @Prop()
  description?: string;
}

@Schema()
class Module {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: [Content] })
  content: Content[];
}

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  instructor: string;

  @Prop({ type: [CourseSection] })
  sections: CourseSection[];

  @Prop({ type: [Progress] })
  progress: Progress[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  students: string[];

  @Prop({ type: [Review] })
  reviews: Review[];

  @Prop({ type: Analytics })
  analytics: Analytics;

  @Prop({ type: Pricing })
  pricing: Pricing;

  @Prop({ type: String, enum: ['draft', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ type: [Module] })
  modules: Module[];

  @Prop({ type: [Content] })
  content: Content[];
}

export type CourseDocument = Course & Document;
export const CourseSchema = SchemaFactory.createForClass(Course);

// Export interfaces for type checking
export interface IProgress extends Progress { }
export interface IReview extends Review { }
export interface IAnalytics extends Analytics { }
export interface IPricing extends Pricing { }
export interface ICourseItem extends CourseItem { }
export interface ICourseSection extends CourseSection { }
export interface IContent extends Content { }
export interface IModule extends Module { }