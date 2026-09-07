import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FeatureSettingsService } from './feature-settings.service';

@Controller('feature-settings')
export class FeatureSettingsController {
  private readonly featureSettingsService: FeatureSettingsService;

  constructor(featureSettingsService: FeatureSettingsService) {
    this.featureSettingsService = featureSettingsService;
  }

  private toGrpcFeatureSetting(setting: any) {
    return {
      id: String(setting.id),
      featureKey: setting.featureKey,
      featureName: setting.featureName,
      isEnabled: Boolean(setting.isEnabled),
      config: setting.config ? JSON.stringify(setting.config) : '',
      startTime: setting.startTime ? new Date(setting.startTime).toISOString() : '',
      endTime: setting.endTime ? new Date(setting.endTime).toISOString() : '',
      createdAt: setting.createdAt ? new Date(setting.createdAt).toISOString() : '',
      updatedAt: setting.updatedAt ? new Date(setting.updatedAt).toISOString() : '',
    };
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
    const settings = await this.featureSettingsService.getAllSettings();
    return { settings: settings.map((setting) => this.toGrpcFeatureSetting(setting)) };
  }

  @GrpcMethod('FeatureSettingsService', 'GetEnabledSettings')
  async getEnabledSettingsGrpc() {
    const settings = await this.featureSettingsService.getEnabledSettings();
    return { settings: settings.map((setting) => this.toGrpcFeatureSetting(setting)) };
  }

  @GrpcMethod('FeatureSettingsService', 'GetSettingByKey')
  async getSettingByKeyGrpc(data: { featureKey: string }) {
    const setting = await this.featureSettingsService.getSettingByKey(data.featureKey);
    return { setting: setting ? this.toGrpcFeatureSetting(setting) : undefined };
  }

  @GrpcMethod('FeatureSettingsService', 'UpdateSetting')
  async updateSettingGrpc(data: { featureKey: string; isEnabled?: boolean; config?: string; startTime?: string; endTime?: string }) {
    const setting = await this.featureSettingsService.updateSetting(data.featureKey, {
      isEnabled: data.isEnabled,
      config: data.config ? JSON.parse(data.config) : undefined,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    });

    return {
      setting: this.toGrpcFeatureSetting(setting),
    };
  }
}
