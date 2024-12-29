import { Controller, Get, Post, UseGuards, Req, Res, Body, HttpException, HttpStatus, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { plainToClass } from 'class-transformer';

@Controller('auth')  // Remove 'api' prefix since it's handled globally
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const jwt = await req.user;
    res.redirect(`http://localhost:3001/login/success?token=${jwt}`);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.loginWithEmailAndPassword(loginDto.email, loginDto.password);
    } catch (error) {
      throw new HttpException(
        error.response || error.message || 'Login failed',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Request() req) {
    try {
      // Transform and validate DTO
      const dto = plainToClass(RegisterDto, req.body);
      console.log('Processing registration for:', dto.email);

      const result = await this.authService.register(dto);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw new HttpException(
        error.response || error.message || 'Registration failed',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}
