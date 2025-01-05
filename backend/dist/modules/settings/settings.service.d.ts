import { Model } from 'mongoose';
import { UserSettings, UserSettingsDocument } from '../../schemas/user-settings.schema';
import { InstructorService } from '../../services/instructor.service';
export declare class SettingsService {
    private userSettingsModel;
    private instructorService;
    private readonly centralizedAuthUrl;
    constructor(userSettingsModel: Model<UserSettingsDocument>, instructorService: InstructorService);
    private validateToken;
    private decodeToken;
    getSettings(token: string): Promise<any>;
    updateSettings(updateSettingsDto: any, token: string): Promise<{
        message: string;
        settings: import("mongoose").Document<unknown, {}, UserSettingsDocument> & UserSettings & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
