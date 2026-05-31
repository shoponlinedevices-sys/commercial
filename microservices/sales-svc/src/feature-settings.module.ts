import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureSettingsController } from './feature-settings.controller';
import { FeatureSettingsService } from './feature-settings.service';
import { FeatureSettingsEntity } from './feature-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureSettingsEntity])],
  controllers: [FeatureSettingsController],
  providers: [FeatureSettingsService],
  exports: [FeatureSettingsService],
})
export class FeatureSettingsModule {}
