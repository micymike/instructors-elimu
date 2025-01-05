import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty()
  profileImage: string;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  currentPassword: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  profileVisibility: string;

  @ApiProperty()
  showRatings: boolean;

  @ApiProperty()
  emailNotifications: boolean;

  @ApiProperty()
  courseUpdates: boolean;

  @ApiProperty()
  studentMessages: boolean;

  @ApiProperty()
  marketingEmails: boolean;
}
