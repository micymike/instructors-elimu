import { Document, Types } from 'mongoose';
export type InstructorDocument = Instructor & Document;
export declare class Instructor {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    courses: Types.ObjectId[];
}
export declare const InstructorSchema: import("mongoose").Schema<Instructor, import("mongoose").Model<Instructor, any, any, any, Document<unknown, any, Instructor> & Instructor & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Instructor, Document<unknown, {}, import("mongoose").FlatRecord<Instructor>> & import("mongoose").FlatRecord<Instructor> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
