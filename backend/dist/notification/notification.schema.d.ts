import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document & {
    _id: Types.ObjectId;
};
export declare class Notification {
    userId: string;
    title: string;
    message: string;
    type: string;
    category: string;
    metadata: {
        courseId?: string;
        studentId?: string;
        instructorId?: string;
        actionUrl?: string;
    };
    read: boolean;
    active: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification> & Notification & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>> & import("mongoose").FlatRecord<Notification> & {
    _id: Types.ObjectId;
}>;
