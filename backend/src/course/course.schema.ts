import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document & { _id: Types.ObjectId };

@Schema()
export class Course {
  @Prop({ required: true })
  title: string = ''; // Default value

  @Prop({ required: true })
  description: string = ''; // Default value

  @Prop({ required: true })
  category: string = ''; // Default value

  @Prop({ type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true })
  level: string = 'beginner';

  @Prop({ type: [String], default: [] })
  prerequisites: string[] = [];

  @Prop({ required: true })
  duration: {
    hours: number;
    minutes: number;
  } = { hours: 0, minutes: 0 };

  @Prop()
  thumbnail: string;

  @Prop({ type: [Object], default: [] })
  syllabus: {
    week: number;
    topic: string;
    description: string;
    activities: string[];
  }[] = [];

  @Prop({ type: [Object], default: [] })
  schedule: {
    sessionTitle: string;
    date: Date;
    duration: number;
    type: 'live' | 'recorded';
    zoomLink?: string;
  }[] = [];

  @Prop({ type: [Object], default: [] })
  resources: {
    title: string;
    type: 'document' | 'video' | 'link' | 'other';
    url: string;
    description?: string;
  }[] = [];

  @Prop({ type: [Object], default: [] })
  assessments: {
    title: string;
    type: 'quiz' | 'assignment' | 'project' | 'exam';
    totalPoints: number;
    dueDate?: Date;
    instructions: string;
  }[] = [];

  @Prop({ type: Object, default: {} })
  aiMetadata: {
    suggestedTopics?: string[];
    contentQualityScore?: number;
    keywordAnalysis?: string[];
    readabilityScore?: number;
    marketAnalysis?: {
      demandScore: number;
      competitionLevel: string;
      suggestedPrice: number;
    };
  };

  @Prop({ type: String, ref: 'Instructor', required: true })
  instructor: string = ''; // Default value

  @Prop({ type: [String], default: [] })
  students: string[] = []; // Default value

  @Prop({ type: [String], required: true })
  learningObjectives: string[] = []; // Default value

  @Prop({ type: [Object], required: true })
  modules: {
    title: string;
    description: string;
    content: {
      type: string;
      url: string;
      duration?: number;
    }[];
  }[] = []; // Default value

  @Prop({ type: Object, required: true })
  pricing: {
    amount: number;
    currency: string;
    discountPrice?: number;
  } = { amount: 0, currency: 'USD' }; // Default value

  @Prop({ type: Object, default: {} })
  analytics: {
    enrollments: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
    activeStudents: number;
  };

  @Prop({ type: [Object], default: [] })
  reviews: {
    student: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];

  @Prop({ type: String, enum: ['draft', 'pending', 'published', 'archived'], default: 'draft' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date })
  publishedAt: Date;

  @Prop({ type: Object, required: true })
  curriculum: {
    system: string;  // e.g., 'KCSE', 'IGCSE', 'IB'
    level: string;   // e.g., 'Form 1', 'IGCSE Level', 'Year 1'
    subject: string; // e.g., 'Mathematics', 'Physics', 'Chemistry'
    subjectLevel?: string; // e.g., 'Foundation', 'Higher', 'Standard', 'Advanced'
    examBoard?: string;    // e.g., 'KNEC', 'Cambridge', 'Edexcel'
    academicYear?: string; // e.g., '2024', '2024-2025'
  };

  @Prop({ type: [String], default: [] })
  topics: string[] = [];

  @Prop({ type: Object })
  subjectSpecifics: {
    branch?: string;      // e.g., 'Algebra', 'Organic Chemistry'
    practicalWork?: boolean;
    labRequirements?: string[];
    mathematicalLevel?: string;
  };
}

export const CourseSchema = SchemaFactory.createForClass(Course);
