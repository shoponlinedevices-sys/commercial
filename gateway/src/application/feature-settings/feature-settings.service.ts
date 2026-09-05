import { Injectable } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export interface FeatureSetting {
  id: string;
  featureKey: string;
  featureName: string;
  isEnabled: boolean;
  config?: Record<string, any>;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface FeatureSettingsGrpcService {
  getAllSettings(data: {}): any;
  getEnabledSettings(data: {}): any;
  getSettingByKey(data: { featureKey: string }): any;
  updateSetting(data: { featureKey: string; isEnabled?: boolean; config?: string; startTime?: string; endTime?: string }): any;
}

@Injectable()
export class FeatureSettingsService implements OnModuleInit {
  private featureSettingsGrpc!: FeatureSettingsGrpcService;

  constructor(@Inject('GRPC_FEATURE_SETTINGS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.featureSettingsGrpc = this.client.getService<FeatureSettingsGrpcService>('FeatureSettingsService');
  }

  async getAllSettings(): Promise<FeatureSetting[]> {
    const response: any = await firstValueFrom(this.featureSettingsGrpc.getAllSettings({}));
    return response.settings || [];
  }

  async getEnabledSettings(): Promise<FeatureSetting[]> {
    const response: any = await firstValueFrom(this.featureSettingsGrpc.getEnabledSettings({}));
    return response.settings || [];
  }

  async getSettingByKey(featureKey: string): Promise<FeatureSetting | null> {
    try {
      const response: any = await firstValueFrom(this.featureSettingsGrpc.getSettingByKey({ featureKey }));
      return response.setting || null;
    } catch (error) {
      return null;
    }
  }

  async updateSetting(
    featureKey: string,
    data: {
      isEnabled?: boolean;
      config?: Record<string, any>;
      startTime?: string;
      endTime?: string;
    }
  ): Promise<FeatureSetting> {
    const response: any = await firstValueFrom(this.featureSettingsGrpc.updateSetting({
      featureKey,
      isEnabled: data.isEnabled,
      config: data.config ? JSON.stringify(data.config) : undefined,
      startTime: data.startTime,
      endTime: data.endTime,
    }));
    return response.setting;
  }
}
