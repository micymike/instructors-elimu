import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CourseLevel } from '../dto/create-course.dto';
export type CourseDocument = Course & Document & {
    _id: Types.ObjectId;
};
export declare class Course {
    _id: Types.ObjectId;
    title: string;
    description: string;
    instructor: {
        id: Types.ObjectId;
        name: string;
        email: string;
    };
    level: CourseLevel;
    deliveryMethod: string;
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
    status: string;
    thumbnail: string;
    duration: {
        totalHours: number;
        weeksDuration: number;
        selfPacedDeadline?: Date;
    };
    category: string;
    price: number;
    subject: string;
    students: string[];
    materials: Array<{
        url: string;
        name: string;
        type: 'pdf' | 'video' | 'document';
        uploadedAt: Date;
        duration?: number;
        size?: number;
        isDownloadable: boolean;
    }>;
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
    topics?: string[];
    learningOutcomes?: string[];
    prerequisites?: string[];
    resources?: string[];
    sections?: string[];
}
export declare const CourseSchema: MongooseSchema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
