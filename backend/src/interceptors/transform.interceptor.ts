import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(err => {
                if (err.response) {
                    return throwError(() => new BadRequestException({
                        message: err.response.message || 'Validation failed',
                        errors: err.response.errors || [],
                    }));
                }
                return throwError(() => err);
            }),
        );
    }
} 