export declare class CreateInstructorDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    expertise?: string;
    experience?: string;
    education?: string;
    certification?: string;
    teachingAreas?: string[];
    bio?: string;
    profilePicture?: string;
    isVerified?: boolean;
    status?: 'pending' | 'active' | 'suspended';
}
