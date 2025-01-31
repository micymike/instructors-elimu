import { Document, Schema as MongooseSchema } from 'mongoose';
declare class Question {
    question: string;
    options: string[];
    correctAnswer: number;
}
export declare class Assessment {
    title: string;
    subject: string;
    topic: string;
    difficulty: string;
    instructor: string;
    questions: Question[];
    status: string;
    aiSuggestions: string;
}
export type AssessmentDocument = Assessment & Document;
export declare const AssessmentSchema: MongooseSchema<Assessment, import("mongoose").Model<Assessment, any, any, any, Document<unknown, any, Assessment> & Assessment & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Assessment, Document<unknown, {}, import("mongoose").FlatRecord<Assessment>> & import("mongoose").FlatRecord<Assessment> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export {};
