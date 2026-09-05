import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
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

  @GrpcMethod('FeatureSettingsService', 'GetAllSettings')
  async getAllSettingsGrpc() {
    return { settings: await this.featureSettingsService.getAllSettings() };
  }

  @GrpcMethod('FeatureSettingsService', 'GetEnabledSettings')
  async getEnabledSettingsGrpc() {
    return { settings: await this.featureSettingsService.getEnabledSettings() };
  }

  @GrpcMethod('FeatureSettingsService', 'GetSettingByKey')
  async getSettingByKeyGrpc(data: { featureKey: string }) {
    return { setting: await this.featureSettingsService.getSettingByKey(data.featureKey) };
  }

  @GrpcMethod('FeatureSettingsService', 'UpdateSetting')
  async updateSettingGrpc(data: { featureKey: string; isEnabled?: boolean; config?: string; startTime?: string; endTime?: string }) {
    return {
      setting: await this.featureSettingsService.updateSetting(data.featureKey, {
        isEnabled: data.isEnabled,
        config: data.config ? JSON.parse(data.config) : undefined,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      }),
    };
  }
}
