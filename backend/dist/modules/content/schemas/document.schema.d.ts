import { HydratedDocument, Types } from 'mongoose';
export type DocumentDocument = HydratedDocument<Document>;
export declare class Document {
    title: string;
    type: string;
    price: number;
    instructorId: Types.ObjectId;
    fileUrl: string;
    publicId: string;
    plagiarismScore?: number;
    plagiarismResults?: Record<string, any>;
    downloadCount: number;
    description?: string;
    tags?: string[];
}
export declare const DocumentSchema: import("mongoose").Schema<Document, import("mongoose").Model<Document, any, any, any, import("mongoose").Document<unknown, any, Document> & Document & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Document, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Document>> & import("mongoose").FlatRecord<Document> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
