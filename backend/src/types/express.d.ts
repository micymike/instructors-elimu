import { User } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        sub?: string;
        email?: string;
        role?: string;
      };
    }

    namespace Multer {
      interface File {
        buffer: Buffer;
        originalname: string;
      }
    }
  }
}
