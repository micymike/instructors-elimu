import { Document, Types } from 'mongoose';
export declare class Resource extends Document {
    title: string;
    type: string;
    subject: string;
    level: string;
    courseId?: Types.ObjectId;
    userId: Types.ObjectId;
    fileUrl?: string;
    isFree: boolean;
    provider: string;
    description?: string;
    url?: string;
    tags?: string[];
    rating?: number;
}
export declare const ResourceSchema: import("mongoose").Schema<Resource, import("mongoose").Model<Resource, any, any, any, Document<unknown, any, Resource> & Resource & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Resource, Document<unknown, {}, import("mongoose").FlatRecord<Resource>> & import("mongoose").FlatRecord<Resource> & {
    _id: Types.ObjectId;
}>;
