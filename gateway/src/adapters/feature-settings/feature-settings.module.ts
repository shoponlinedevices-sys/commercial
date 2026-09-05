import { Module } from '@nestjs/common';
import { FeatureSettingsController } from './feature-settings.controller';
import { FeatureSettingsService } from '../../application/feature-settings/feature-settings.service';

@Module({
  imports: [],
  controllers: [FeatureSettingsController],
  providers: [FeatureSettingsService],
  exports: [FeatureSettingsService],
})
export class FeatureSettingsModule {}
