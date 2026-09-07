import { Injectable } from '@nestjs/common';

export type HistoryLog = {
  id: string | number;
  action: string;
  entityType: string;
  entityId: string;
  source: string;
  createdBy: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

@Injectable()
export class HistoryLogService {
  async findAll(limit = 200): Promise<HistoryLog[]> {
    const serviceUrls = [
      process.env.SALES_SERVICE_URL || 'http://localhost:3001',
      process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003',
      process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004',
    ];

    const responses = await Promise.all(serviceUrls.map(async (url) => {
      try {
        const response = await fetch(`${url}/history-logs?limit=${limit}`);
        if (!response.ok) return [];
        return await response.json() as HistoryLog[];
      } catch (error) {
        console.error(`[HistoryLogService] Failed to read ${url}:`, error);
        return [];
      }
    }));

    return responses.flat()
      .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
      .slice(0, limit);
  }
}
