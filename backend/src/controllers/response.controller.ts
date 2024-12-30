import { Controller, Post, Body } from '@nestjs/common';
import { formatResponse } from '../utils/formatResponse';

@Controller('response')
export class ResponseController {
  @Post('format')
  format(@Body('response') response: string) {
    return formatResponse(response);
  }
}
