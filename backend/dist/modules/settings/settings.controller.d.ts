import { SettingsService } from './settings.service';
import { Request } from 'express';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(req: Request): Promise<{
        status: string;
        data: any;
    }>;
    updateSettings(req: Request, settings: any): Promise<{
        status: string;
        data: {
            message: string;
            settings: import("mongoose").Document<unknown, {}, import("../../schemas/user-settings.schema").UserSettingsDocument> & import("../../schemas/user-settings.schema").UserSettings & import("mongoose").Document<unknown, any, any> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            };
        };
    }>;
}
