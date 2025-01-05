import { ExpressRequest } from '../common/interfaces/express-request.interface';
import { SettingsService } from '../services/settings.service';
import { ConfigService } from '@nestjs/config';
export declare class SettingsController {
    private readonly settingsService;
    private readonly configService;
    private readonly logger;
    constructor(settingsService: SettingsService, configService: ConfigService);
    getUserSettings(req: ExpressRequest): Promise<{
        message: string;
        data: {
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
        };
    }>;
    private authenticateRequest;
}
