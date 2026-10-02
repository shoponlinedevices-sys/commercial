import { Repository } from 'typeorm';
import { FeatureSettingsEntity } from './feature-settings.entity';
export declare class FeatureSettingsService {
    private readonly featureSettingsRepository;
    constructor(featureSettingsRepository: Repository<FeatureSettingsEntity>);
    getAllSettings(): Promise<FeatureSettingsEntity[]>;
    getSettingByKey(featureKey: string): Promise<FeatureSettingsEntity | null>;
    getEnabledSettings(): Promise<FeatureSettingsEntity[]>;
    updateSetting(featureKey: string, updateData: {
        isEnabled?: boolean;
        config?: Record<string, any>;
        startTime?: Date;
        endTime?: Date;
    }): Promise<FeatureSettingsEntity>;
    createSetting(data: {
        featureKey: string;
        featureName: string;
        isEnabled?: boolean;
        config?: Record<string, any>;
        startTime?: Date;
        endTime?: Date;
    }): Promise<FeatureSettingsEntity>;
}
