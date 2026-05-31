import { FeatureSettingsService } from './feature-settings.service';
export declare class FeatureSettingsController {
    private readonly featureSettingsService;
    constructor(featureSettingsService: FeatureSettingsService);
    getAllSettings(): Promise<import("./feature-settings.entity").FeatureSettingsEntity[]>;
    getEnabledSettings(): Promise<import("./feature-settings.entity").FeatureSettingsEntity[]>;
    getSettingByKey(featureKey: string): Promise<import("./feature-settings.entity").FeatureSettingsEntity>;
    updateSetting(featureKey: string, body: {
        isEnabled?: boolean;
        config?: Record<string, any>;
        startTime?: string;
        endTime?: string;
    }): Promise<import("./feature-settings.entity").FeatureSettingsEntity>;
}
