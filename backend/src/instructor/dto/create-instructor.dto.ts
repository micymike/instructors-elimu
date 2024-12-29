import { IsString, IsEmail, IsOptional, IsArray, ValidateNested, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}

export class CreateInstructorDto {
  @IsString()
  firstName: string = ''; // Default value

  @IsString()
  lastName: string = ''; // Default value

  @IsEmail()
  email: string = ''; // Default value

  @IsString()
  password: string = ''; // Default value

  @IsOptional()
  @IsString()
  phoneNumber?: string = ''; // Default value

  @IsString()
  expertise: string = ''; // Default value

  @IsString()
  experience: string = ''; // Default value

  @IsString()
  education: string = ''; // Default value

  @IsOptional()
  @IsString()
  certification?: string = ''; // Default value

  @IsArray()
  @IsString({ each: true })
  teachingAreas: string[] = []; // Default value

  @IsString()
  bio: string = ''; // Default value

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto; // Default value

  @IsOptional()
  @IsString()
  profilePicture?: string = ''; // Default value

  constructor(
    firstName: string = '',
    lastName: string = '',
    email: string = '',
    password: string = '',
    phoneNumber: string = '',
    expertise: string = '',
    experience: string = '',
    education: string = '',
    certification: string = '',
    teachingAreas: string[] = [],
    bio: string = '',
    socialLinks: SocialLinksDto = new SocialLinksDto(),
    profilePicture: string = '',
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
    this.expertise = expertise;
    this.experience = experience;
    this.education = education;
    this.certification = certification;
    this.teachingAreas = teachingAreas;
    this.bio = bio;
    this.socialLinks = socialLinks;
    this.profilePicture = profilePicture;
  }
}
