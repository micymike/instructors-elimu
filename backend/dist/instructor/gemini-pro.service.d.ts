import { HttpService } from '@nestjs/axios';
export declare class GeminiProService {
    private readonly httpService;
    constructor(httpService: HttpService);
    getAIContentAssistance(data: any): Promise<any>;
}
