import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class TokenValidatorMiddleware implements NestMiddleware {
    private readonly centralizedAuthUrl;
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
