import { 
  Controller, 
  Post, 
  Get,
  Patch,
  Delete,
  Body, 
  Param,
  UseInterceptors, 
  UploadedFile, 
  Req 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../services/s3.service';
import { InstructorService } from '../services/instructor.service';
import { UpdateInstructorDto } from '../dto/update-instructor.dto';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('instructors')
export class InstructorController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly instructorService: InstructorService,
  ) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @UploadedFile() file: UploadedFile,
    @Req() req: any
  ) {
    try {
      const url = await this.s3Service.uploadProfilePicture(file, req.user.sub);
      await this.instructorService.updateProfilePicture(req.user.sub, url);
      return { url };
    } catch (error) {
      throw new Error('Failed to upload profile picture');
    }
  }

  @Get()
  async findAll() {
    return this.instructorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.instructorService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInstructorDto: UpdateInstructorDto
  ) {
    return this.instructorService.update(id, updateInstructorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.instructorService.remove(id);
  }
} 