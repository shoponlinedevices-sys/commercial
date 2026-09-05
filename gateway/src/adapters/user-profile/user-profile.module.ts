import { Module } from '@nestjs/common';
import { UserProfileController } from './user-profile.controller';
import { GrpcClientsModule } from '../../infrastructure/grpc/grpc-clients.module';

@Module({
  imports: [GrpcClientsModule],
  controllers: [UserProfileController],
  providers: [],
})
export class UserProfileModule {}
