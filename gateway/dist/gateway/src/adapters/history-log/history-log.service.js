"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryLogService = void 0;
const common_1 = require("@nestjs/common");
let HistoryLogService = class HistoryLogService {
    async findAll(limit = 200) {
        const serviceUrls = [
            process.env.SALES_SERVICE_URL || 'http://localhost:3001',
            process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003',
            process.env.CONTACTS_SERVICE_URL || 'http://localhost:3004',
        ];
        const responses = await Promise.all(serviceUrls.map(async (url) => {
            try {
                const response = await fetch(`${url}/history-logs?limit=${limit}`);
                if (!response.ok)
                    return [];
                return await response.json();
            }
            catch (error) {
                console.error(`[HistoryLogService] Failed to read ${url}:`, error);
                return [];
            }
        }));
        return responses.flat()
            .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())
            .slice(0, limit);
    }
};
exports.HistoryLogService = HistoryLogService;
exports.HistoryLogService = HistoryLogService = __decorate([
    (0, common_1.Injectable)()
], HistoryLogService);
//# sourceMappingURL=history-log.service.js.map