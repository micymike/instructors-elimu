import { Model } from 'mongoose';
import { Instructor } from '../schemas/instructor.schema';
export declare class SettingsService {
    private instructorModel;
    private readonly logger;
    constructor(instructorModel: Model<Instructor>);
    getUserSettings(email: string): Promise<{
        personalInfo: {
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            isVerified: boolean;
            expertise: string;
            profilePicture: string;
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
