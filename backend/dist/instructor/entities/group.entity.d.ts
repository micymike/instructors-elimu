import { Document } from 'mongoose';
export declare class Group extends Document {
    name: string;
    instructorId: string;
    studentIds: string[];
    meetingIds: string[];
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(name: string, instructorId: string, studentIds?: string[], meetingIds?: string[], createdAt?: Date, updatedAt?: Date, description?: string);
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group> & Group & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>> & import("mongoose").FlatRecord<Group> & {
    _id: import("mongoose").Types.ObjectId;
}>;
