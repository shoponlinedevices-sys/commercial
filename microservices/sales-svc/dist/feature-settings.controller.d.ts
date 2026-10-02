import { FeatureSettingsService } from './feature-settings.service';
export declare class FeatureSettingsController {
    private readonly featureSettingsService;
    constructor(featureSettingsService: FeatureSettingsService);
    private toGrpcFeatureSetting;
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
        settings: {
            id: string;
            featureKey: any;
            featureName: any;
            isEnabled: boolean;
            config: string;
            startTime: string;
            endTime: string;
            createdAt: string;
            updatedAt: string;
        }[];
    }>;
    getEnabledSettingsGrpc(): Promise<{
        settings: {
            id: string;
            featureKey: any;
            featureName: any;
            isEnabled: boolean;
            config: string;
            startTime: string;
            endTime: string;
            createdAt: string;
            updatedAt: string;
        }[];
    }>;
    getSettingByKeyGrpc(data: {
        featureKey: string;
    }): Promise<{
        setting: {
            id: string;
            featureKey: any;
            featureName: any;
            isEnabled: boolean;
            config: string;
            startTime: string;
            endTime: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
    updateSettingGrpc(data: {
        featureKey: string;
        isEnabled?: boolean;
        config?: string;
        startTime?: string;
        endTime?: string;
    }): Promise<{
        setting: {
            id: string;
            featureKey: any;
            featureName: any;
            isEnabled: boolean;
            config: string;
            startTime: string;
            endTime: string;
            createdAt: string;
            updatedAt: string;
        };
    }>;
}
