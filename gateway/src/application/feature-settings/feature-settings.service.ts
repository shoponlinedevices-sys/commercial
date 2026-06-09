import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
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

@Injectable()
export class FeatureSettingsService {
  private readonly salesServiceUrl = 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async getAllSettings(): Promise<FeatureSetting[]> {
    const response = await firstValueFrom(
      this.httpService.get<FeatureSetting[]>(`${this.salesServiceUrl}/feature-settings`)
    );
    return response.data;
  }

  async getEnabledSettings(): Promise<FeatureSetting[]> {
    const response = await firstValueFrom(
      this.httpService.get<FeatureSetting[]>(`${this.salesServiceUrl}/feature-settings/enabled`)
    );
    return response.data;
  }

  async getSettingByKey(featureKey: string): Promise<FeatureSetting | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<FeatureSetting>(`${this.salesServiceUrl}/feature-settings/${featureKey}`)
      );
      return response.data;
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
    const response = await firstValueFrom(
      this.httpService.put<FeatureSetting>(`${this.salesServiceUrl}/feature-settings/${featureKey}`, data)
    );
    return response.data;
  }
}
