import { Document, Schema as MongooseSchema } from 'mongoose';
export interface VideoResponse extends Video {
    id: string;
}
export type VideoDocument = Video & Document;
export declare class Video {
    title: string;
    description: string;
    cloudinaryId: string;
    url: string;
    duration: number;
    thumbnail: string;
    instructor: MongooseSchema.Types.ObjectId;
    visibility: string;
    tags: string[];
    views: number;
    courses: MongooseSchema.Types.ObjectId[];
    transcription: string;
    captions: string;
    quality: string;
    size: number;
    format: string;
    isProcessed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VideoSchema: MongooseSchema<Video, import("mongoose").Model<Video, any, any, any, Document<unknown, any, Video> & Video & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Video, Document<unknown, {}, import("mongoose").FlatRecord<Video>> & import("mongoose").FlatRecord<Video> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
