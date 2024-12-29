import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Instructor, InstructorDocument } from '../instructor/instructor.schema';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Instructor.name) private instructorModel: Model<InstructorDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ...existing code...

  async validateOAuthUser(user: any): Promise<any> {
    let instructor = await this.instructorModel.findOne({ email: user.email.toLowerCase().trim() });
    if (!instructor) {
      instructor = new this.instructorModel({
        email: user.email.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
      });
      await instructor.save();
    }
    return instructor;
  }

  async loginWithOAuth(user: any) {
    const payload = { email: user.email, sub: user._id, role: 'instructor' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithEmailAndPassword(email: string, password: string) {
    try {
      const instructor = await this.instructorModel.findOne({ email: email.toLowerCase().trim() }).exec();
      
      if (!instructor) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, instructor.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
      }

      const payload = { 
        email: instructor.email, 
        sub: instructor._id, 
        role: 'instructor',
        isVerified: instructor.isVerified,
        status: instructor.status
      };

      return {
        success: true,
        data: {
          access_token: this.jwtService.sign(payload, { secret: jwtSecret }),
          instructor: {
            id: instructor._id,
            email: instructor.email,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            isVerified: instructor.isVerified,
            status: instructor.status
          }
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        error instanceof UnauthorizedException ? HttpStatus.UNAUTHORIZED : HttpStatus.BAD_REQUEST
      );
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.instructorModel.findOne({ 
        email: registerDto.email.toLowerCase().trim() 
      });
      
      if (existingUser) {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Registration failed',
          message: 'Email already exists'
        }, HttpStatus.BAD_REQUEST);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Create new instructor
      const newInstructor = new this.instructorModel({
        email: registerDto.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phoneNumber: registerDto.phoneNumber,
        expertise: registerDto.expertise,
        bio: registerDto.bio,
        education: registerDto.education,
        experience: registerDto.experience,
        teachingAreas: registerDto.teachingAreas
      });

      // Save to database
      const savedInstructor = await newInstructor.save();
      console.log('Instructor saved successfully:', savedInstructor._id);

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
      }

      // Generate JWT token
      const payload = { 
        email: savedInstructor.email, 
        sub: savedInstructor._id,
        role: 'instructor'
      };

      return {
        success: true,
        message: 'Registration successful',
        data: {
          access_token: this.jwtService.sign(payload, { secret: jwtSecret }),
          instructor: {
            id: savedInstructor._id,
            email: savedInstructor.email,
            firstName: savedInstructor.firstName,
            lastName: savedInstructor.lastName,
            isVerified: savedInstructor.isVerified,
            status: savedInstructor.status
          }
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new HttpException(
        error.response || error.message || 'Registration failed',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }
}
