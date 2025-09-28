import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [], // Import AuthModule to get AuthGuard,
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
