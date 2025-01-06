import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/schemas/user.schema';
import { EmailVerificationService } from './services/email-verification.service';
import { EmailVerificationController } from './controllers/email-verification.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    controllers: [EmailVerificationController],
    providers: [EmailVerificationService],
    exports: [EmailVerificationService]
})
export class AuthModule {}
