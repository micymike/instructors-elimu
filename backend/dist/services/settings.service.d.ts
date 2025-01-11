import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';
export declare class SettingsService {
    private instructorModel;
    private readonly logger;
    constructor(instructorModel: Model<Instructor>);
    getUserSettings(email: string, includeProfilePicture?: boolean): Promise<{
        personalInfo: any;
        preferences: {
            notifications: boolean;
            language: string;
            theme: string;
        };
        teachingProfile: {
            phoneNumber: string;
            experience: string;
            education: string;
            certification: string;
            teachingAreas: string[];
            bio: string;
        };
    }>;
    updateUserSettings(email: string, settingsData: any): Promise<{
        personalInfo: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string;
            expertise: string;
            bio: string;
            profilePicture: {
                data: string;
                contentType: string;
                originalName: string;
            };
        };
        preferences: {
            notifications: boolean;
            language: string;
            theme: string;
        };
        teachingProfile: {
            phoneNumber: string;
            experience: string;
            education: string;
            certification: string;
            teachingAreas: string[];
            bio: string;
        };
    }>;
}
