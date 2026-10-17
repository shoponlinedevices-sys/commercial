import { Module } from '@nestjs/common';
import { CmsGrpcController } from './cms.grpc.controller';
import { CmsService } from './cms.service';

@Module({
  controllers: [CmsGrpcController],
  providers: [CmsService],
})
export class CmsModule {}
