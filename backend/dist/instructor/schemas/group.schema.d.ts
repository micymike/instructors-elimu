import { Document } from 'mongoose';
export declare class Group extends Document {
    name: string;
    instructorId: string;
    description?: string;
    studentIds?: string[];
}
export declare const GroupSchema: import("mongoose").Schema<Group, import("mongoose").Model<Group, any, any, any, Document<unknown, any, Group> & Group & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Group, Document<unknown, {}, import("mongoose").FlatRecord<Group>> & import("mongoose").FlatRecord<Group> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
