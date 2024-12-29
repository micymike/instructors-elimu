import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { password, ...result } = user.toObject();
    return result;
  }

  @Patch('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('preferences/:id')
  async updatePreferences(@Param('id') id: string, @Body() preferences: any) {
    return this.usersService.updatePreferences(id, preferences);
  }

  @Post('verify-email/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.usersService.verifyEmail(token);
  }

  @Post('reset-password-request')
  async requestPasswordReset(@Body('email') email: string) {
    const token = Math.random().toString(36).substr(2, 15);
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    await this.usersService.setResetPasswordToken(email, token, expires);
    
    // Here you would typically send an email with the reset link
    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string,
  ) {
    const user = await this.usersService.resetPassword(token, password);
    if (!user) {
      return { message: 'Invalid or expired password reset token' };
    }
    return { message: 'Password has been reset successfully' };
  }
}
