import { Document } from 'mongoose';
export interface Course extends Document {
    _id: string;
    title: string;
    description: string;
    instructor: string;
    modules: Array<{
        title: string;
        description: string;
        content: Array<{
            type: string;
            title: string;
            description: string;
            url?: string;
            duration?: number;
        }>;
    }>;
    status: string;
    thumbnail: string;
    duration: string;
    level: string;
    category: string;
    students: string[];
    createdAt?: Date;
    updatedAt?: Date;
    topics?: string[];
    learningOutcomes?: string[];
    prerequisites?: string[];
    resources?: string[];
    sections?: string[];
}
