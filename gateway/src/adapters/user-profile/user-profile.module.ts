import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from '../../application/user-profile/user-profile.service';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, AccountRepository],
  exports: [UserProfileService],
})
export class UserProfileModule {}
