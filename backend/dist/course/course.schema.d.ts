import { Document, Types } from 'mongoose';
export type CourseDocument = Course & Document & {
    _id: Types.ObjectId;
};
export declare class Course {
    title: string;
    description: string;
    category: string;
    level: string;
    prerequisites: string[];
    duration: {
        hours: number;
        minutes: number;
    };
    thumbnail: string;
    syllabus: {
        week: number;
        topic: string;
        description: string;
        activities: string[];
    }[];
    schedule: {
        sessionTitle: string;
        date: Date;
        duration: number;
        type: 'live' | 'recorded';
        zoomLink?: string;
    }[];
    resources: {
        title: string;
        type: 'document' | 'video' | 'link' | 'other';
        url: string;
        description?: string;
    }[];
    assessments: {
        title: string;
        type: 'quiz' | 'assignment' | 'project' | 'exam';
        totalPoints: number;
        dueDate?: Date;
        instructions: string;
    }[];
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
    instructor: string;
    students: string[];
    learningObjectives: string[];
    modules: {
        title: string;
        description: string;
        content: {
            type: string;
            url: string;
            duration?: number;
        }[];
    }[];
    pricing: {
        amount: number;
        currency: string;
        discountPrice?: number;
    };
    analytics: {
        enrollments: number;
        completionRate: number;
        averageRating: number;
        revenue: number;
        activeStudents: number;
    };
    reviews: {
        student: string;
        rating: number;
        comment: string;
        createdAt: Date;
    }[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    curriculum: {
        system: string;
        level: string;
        subject: string;
        subjectLevel?: string;
        examBoard?: string;
        academicYear?: string;
    };
    topics: string[];
    subjectSpecifics: {
        branch?: string;
        practicalWork?: boolean;
        labRequirements?: string[];
        mathematicalLevel?: string;
    };
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
