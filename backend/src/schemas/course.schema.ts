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

  @Prop({ 
    type: {
      id: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    required: true 
  })
  instructor: {
    id: Types.ObjectId;
    name: string;
    email: string;
  };

  @Prop({ required: true, enum: Object.values(CourseLevel) })
  level: CourseLevel;

  @Prop({ required: true, enum: ['on-demand', 'live', 'self-paced'], default: 'on-demand' })
  deliveryMethod: string;

  @Prop([{
    title: String,
    description: String,
    content: [{
      type: {
        type: String,
        enum: ['video', 'document', 'quiz', 'assignment', 'live-session'],
      },
      title: String,
      description: String,
      url: String,
      duration: Number, // in minutes
      scheduledTime: Date, // for live sessions
      meetingLink: String, // for live sessions
      maxDuration: { type: Number, max: 45 }, // max 45 minutes for videos
      resourceType: { 
        type: String, 
        enum: ['pdf', 'video', 'document', 'quiz'] 
      },
      isRequired: { type: Boolean, default: false },
      dueDate: Date, // for assignments
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
      scheduledTime?: Date;
      meetingLink?: string;
      maxDuration?: number;
      resourceType?: string;
      isRequired?: boolean;
      dueDate?: Date;
    }>;
  }>;

  @Prop({ default: 'draft', enum: ['draft', 'published', 'archived'] })
  status: string;

  @Prop()
  thumbnail: string;

  @Prop({ 
    type: {
      totalHours: Number,
      weeksDuration: Number,
      selfPacedDeadline: Date, // for self-paced courses
    }
  })
  duration: {
    totalHours: number;
    weeksDuration: number;
    selfPacedDeadline?: Date;
  };

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
    uploadedAt: { type: Date, default: Date.now },
    duration: { type: Number }, // in minutes for videos
    size: { type: Number }, // in bytes
    isDownloadable: { type: Boolean, default: true }
  }], default: [] })
  materials: Array<{
    url: string;
    name: string;
    type: 'pdf' | 'video' | 'document';
    uploadedAt: Date;
    duration?: number;
    size?: number;
    isDownloadable: boolean;
  }>;

  @Prop({ type: [{
    sessionDate: Date,
    startTime: String,
    endTime: String,
    topic: String,
    meetingLink: String,
    recordingUrl: String,
    materials: [{
      url: String,
      name: String,
      type: { type: String, enum: ['pdf', 'video', 'document'] }
    }]
  }], default: [] })
  liveSessions: Array<{
    sessionDate: Date;
    startTime: string;
    endTime: string;
    topic: string;
    meetingLink: string;
    recordingUrl?: string;
    materials: Array<{
      url: string;
      name: string;
      type: string;
    }>;
  }>;

  @Prop({ type: {
    isEnrollmentOpen: { type: Boolean, default: true },
    startDate: Date,
    endDate: Date,
    maxStudents: Number,
    prerequisites: [String],
    objectives: [String],
    certificateAvailable: { type: Boolean, default: false },
    completionCriteria: {
      minAttendance: Number, // percentage
      minAssignments: Number,
      minQuizScore: Number
    }
  }})
  courseSettings: {
    isEnrollmentOpen: boolean;
    startDate?: Date;
    endDate?: Date;
    maxStudents?: number;
    prerequisites: string[];
    objectives: string[];
    certificateAvailable: boolean;
    completionCriteria?: {
      minAttendance: number;
      minAssignments: number;
      minQuizScore: number;
    };
  };

  @Prop([String])
  topics?: string[];

  @Prop([String])
  learningOutcomes?: string[];

  @Prop([String])
  prerequisites?: string[];

  @Prop([String])
  resources?: string[];

  @Prop([String])
  sections?: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
