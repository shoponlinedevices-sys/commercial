export declare class FeatureSettingsEntity {
    id: string;
    featureKey: string;
    featureName: string;
    isEnabled: boolean;
    config?: Record<string, any>;
    startTime?: Date;
    endTime?: Date;
    createdAt: Date;
    updatedAt: Date;
}
