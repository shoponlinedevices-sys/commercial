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
    getAllSettingsGrpc(): Promise<{
        settings: import("./feature-settings.entity").FeatureSettingsEntity[];
    }>;
    getEnabledSettingsGrpc(): Promise<{
        settings: import("./feature-settings.entity").FeatureSettingsEntity[];
    }>;
    getSettingByKeyGrpc(data: {
        featureKey: string;
    }): Promise<{
        setting: import("./feature-settings.entity").FeatureSettingsEntity;
    }>;
    updateSettingGrpc(data: {
        featureKey: string;
        isEnabled?: boolean;
        config?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<{
        setting: import("./feature-settings.entity").FeatureSettingsEntity;
    }>;
}
