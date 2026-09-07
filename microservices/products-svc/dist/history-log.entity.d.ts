export declare class HistoryLogEntity {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    source: string;
    createdBy: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
