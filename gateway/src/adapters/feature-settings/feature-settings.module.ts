import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FeatureSettingsController } from './feature-settings.controller';
import { FeatureSettingsService } from '../../application/feature-settings/feature-settings.service';

@Module({
  imports: [HttpModule],
  controllers: [FeatureSettingsController],
  providers: [FeatureSettingsService],
  exports: [FeatureSettingsService],
})
export class FeatureSettingsModule {}
