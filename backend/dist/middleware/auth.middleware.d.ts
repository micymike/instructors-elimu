import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly centralizedAuthUrl;
    constructor();
    use(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    private decodeToken;
}
