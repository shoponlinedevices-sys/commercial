"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryLogService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let HistoryLogService = class HistoryLogService {
    constructor(salesClient, productsClient, contactsClient) {
        this.salesClient = salesClient;
        this.productsClient = productsClient;
        this.contactsClient = contactsClient;
    }
    onModuleInit() {
        this.sales = this.salesClient.getService('OrdersService');
        this.products = this.productsClient.getService('ProductService');
        this.contacts = this.contactsClient.getService('ContactsService');
    }
    async findAll(limit = 200) {
        var _a, _b, _c;
        const responses = await Promise.all([
            (_a = this.sales) === null || _a === void 0 ? void 0 : _a.getHistoryLogs({ limit }),
            (_b = this.products) === null || _b === void 0 ? void 0 : _b.getHistoryLogs({ limit }),
            (_c = this.contacts) === null || _c === void 0 ? void 0 : _c.getHistoryLogs({ limit }),
        ].map(async (call) => {
            try {
                if (!call)
                    return [];
                const response = await (0, rxjs_1.firstValueFrom)(call);
                return ((response === null || response === void 0 ? void 0 : response.logs) || []).map((log) => (Object.assign(Object.assign({}, log), { metadata: log.metadata ? JSON.parse(log.metadata) : undefined })));
            }
            catch (error) {
                console.error('[HistoryLogService] Failed to read history via gRPC:', error);
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
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('GRPC_ORDERS_SERVICE')),
    __param(1, (0, common_1.Inject)('GRPC_PRODUCTS_SERVICE')),
    __param(2, (0, common_1.Inject)('GRPC_CONTACTS_SERVICE')),
    __metadata("design:paramtypes", [Object, Object, Object])
], HistoryLogService);
//# sourceMappingURL=history-log.service.js.map