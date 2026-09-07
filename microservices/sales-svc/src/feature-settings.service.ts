import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureSettingsEntity } from './feature-settings.entity';

@Injectable()
export class FeatureSettingsService {
  constructor(
    @InjectRepository(FeatureSettingsEntity)
    private readonly featureSettingsRepository: Repository<FeatureSettingsEntity>,
  ) {}

  async getAllSettings(): Promise<FeatureSettingsEntity[]> {
    return this.featureSettingsRepository.find();
  }

  async getSettingByKey(featureKey: string): Promise<FeatureSettingsEntity | null> {
    return this.featureSettingsRepository.findOne({
      where: { featureKey },
    });
  }

  async getEnabledSettings(): Promise<FeatureSettingsEntity[]> {
    return this.featureSettingsRepository.find({
      where: { isEnabled: true },
    });
  }

  async updateSetting(
    featureKey: string,
    updateData: {
      isEnabled?: boolean;
      config?: Record<string, any>;
      startTime?: Date;
      endTime?: Date;
    },
  ): Promise<FeatureSettingsEntity> {
    const setting = await this.featureSettingsRepository.findOne({
      where: { featureKey },
    });

    if (!setting) {
      throw new Error(`Feature setting with key ${featureKey} not found`);
    }

    Object.assign(
      setting,
      Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined),
      ),
    );
    return this.featureSettingsRepository.save(setting);
  }

  async createSetting(data: {
    featureKey: string;
    featureName: string;
    isEnabled?: boolean;
    config?: Record<string, any>;
    startTime?: Date;
    endTime?: Date;
  }): Promise<FeatureSettingsEntity> {
    const setting = this.featureSettingsRepository.create(data);
    return this.featureSettingsRepository.save(setting);
  }
}
