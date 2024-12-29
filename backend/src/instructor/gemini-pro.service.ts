import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeminiProService {
  constructor(private readonly httpService: HttpService) {}

  async getAIContentAssistance(data: any): Promise<any> {
    const apiKey = process.env.GEMINI_PRO_API_KEY;
    const response = await firstValueFrom(
      this.httpService.post('https://api.gemini-pro.com/ai', data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      })
    );
    return response.data;
  }
}
