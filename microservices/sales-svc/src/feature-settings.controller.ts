import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { FeatureSettingsService } from './feature-settings.service';

@Controller('feature-settings')
export class FeatureSettingsController {
  private readonly featureSettingsService: FeatureSettingsService;

  constructor(featureSettingsService: FeatureSettingsService) {
    this.featureSettingsService = featureSettingsService;
  }

  @Get()
  async getAllSettings() {
    return this.featureSettingsService.getAllSettings();
  }

  @Get('enabled')
  async getEnabledSettings() {
    return this.featureSettingsService.getEnabledSettings();
  }

  @Get(':featureKey')
  async getSettingByKey(@Param('featureKey') featureKey: string) {
    return this.featureSettingsService.getSettingByKey(featureKey);
  }

  @Put(':featureKey')
  async updateSetting(
    @Param('featureKey') featureKey: string,
    @Body() body: {
      isEnabled?: boolean;
      config?: Record<string, any>;
      startTime?: string;
      endTime?: string;
    },
  ) {
    const updateData: any = {
      ...body,
    };

    if (body.startTime) {
      updateData.startTime = new Date(body.startTime);
    }

    if (body.endTime) {
      updateData.endTime = new Date(body.endTime);
    }

    return this.featureSettingsService.updateSetting(featureKey, updateData);
  }
}
