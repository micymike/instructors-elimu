import { Document, Types } from 'mongoose';
export declare class UserPDF extends Document {
    filename: string;
    fileId: Types.ObjectId;
    userId: string;
    size: number;
    mimeType: string;
    uploadDate: Date;
    metadata: {
        originalName: string;
        encoding: string;
        mimeType: string;
    };
    isDeleted: boolean;
    isActive: boolean;
}
export declare const UserPDFSchema: import("mongoose").Schema<UserPDF, import("mongoose").Model<UserPDF, any, any, any, Document<unknown, any, UserPDF> & UserPDF & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserPDF, Document<unknown, {}, import("mongoose").FlatRecord<UserPDF>> & import("mongoose").FlatRecord<UserPDF> & {
    _id: Types.ObjectId;
}>;
