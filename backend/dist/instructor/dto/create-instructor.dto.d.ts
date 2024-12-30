declare class SocialLinksDto {
    linkedin?: string;
    twitter?: string;
    website?: string;
}
export declare class CreateInstructorDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    expertise: string;
    experience: string;
    education: string;
    certification?: string;
    teachingAreas: string[];
    bio: string;
    socialLinks?: SocialLinksDto;
    profilePicture?: string;
    constructor(firstName?: string, lastName?: string, email?: string, password?: string, phoneNumber?: string, expertise?: string, experience?: string, education?: string, certification?: string, teachingAreas?: string[], bio?: string, socialLinks?: SocialLinksDto, profilePicture?: string);
}
export {};
