import { Document } from 'mongoose';
export type UserSettingsDocument = UserSettings & Document;
export declare class UserSettings {
    profileImage: string;
    displayName: string;
    bio: string;
    profileVisibility: string;
    showRatings: boolean;
    emailNotifications: boolean;
    courseUpdates: boolean;
    studentMessages: boolean;
    marketingEmails: boolean;
}
export declare const UserSettingsSchema: import("mongoose").Schema<UserSettings, import("mongoose").Model<UserSettings, any, any, any, Document<unknown, any, UserSettings> & UserSettings & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSettings, Document<unknown, {}, import("mongoose").FlatRecord<UserSettings>> & import("mongoose").FlatRecord<UserSettings> & {
    _id: import("mongoose").Types.ObjectId;
}>;
