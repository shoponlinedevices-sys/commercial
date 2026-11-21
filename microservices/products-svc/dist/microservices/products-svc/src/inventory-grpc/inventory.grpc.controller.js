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
var InventoryGrpcController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryGrpcController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const product_service_1 = require("../services/product.service");
let InventoryGrpcController = InventoryGrpcController_1 = class InventoryGrpcController {
    constructor(productService) {
        this.productService = productService;
        this.logger = new common_1.Logger(InventoryGrpcController_1.name);
    }
    normalizeCreatedBy(body) {
        const rawCreatedBy = body.createdBy;
        if (rawCreatedBy === undefined || rawCreatedBy === null) {
            return body;
        }
        const createdBy = typeof rawCreatedBy === 'number'
            ? rawCreatedBy
            : typeof rawCreatedBy === 'string' && /^\d+$/.test(rawCreatedBy)
                ? Number(rawCreatedBy)
                : Number.NaN;
        if (Number.isSafeInteger(createdBy) && createdBy > 0) {
            return { ...body, createdBy };
        }
        this.logger.warn(`Ignoring non-numeric inventory createdBy value: ${String(rawCreatedBy)}`);
        return { ...body, createdBy: undefined };
    }
    async saleStock(body) {
        return this.productService.saleInventory(this.normalizeCreatedBy(body));
    }
    async returnInventory(body) {
        return this.productService.returnInventory(this.normalizeCreatedBy(body));
    }
    async summary() {
        return this.productService.getInventorySummary();
    }
    async getItems(data) {
        return this.productService.getInventoryList(data);
    }
    async getItem(data) {
        const detail = await this.productService.getInventoryDetail(Number(data.productId));
        if (!detail) {
            return { item: null };
        }
        const item = detail.item ?? detail;
        return { item: { ...item, productId: item.productId, productName: item.productName ?? item.product?.name ?? '', sku: item.sku ?? item.product?.sku ?? '', quantityAvailable: item.quantityAvailable } };
    }
    async getTransactions(data) {
        return this.productService.getInventoryTransactions({
            page: Number(data.page) || 1,
            limit: Number(data.limit) || 20,
            productId: Number(data.productId) || undefined,
            type: data.type || undefined,
        });
    }
    async importStock(data) {
        return this.productService.importInventory(this.normalizeCreatedBy(data));
    }
    async reserveStock(data) {
        return this.productService.reserveInventory(this.normalizeCreatedBy(data));
    }
    async releaseStock(data) {
        return this.productService.releaseInventory(this.normalizeCreatedBy(data));
    }
    async adjustStock(data) {
        return this.productService.adjustInventory(this.normalizeCreatedBy(data));
    }
};
exports.InventoryGrpcController = InventoryGrpcController;
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'SaleStock'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "saleStock", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'ReturnInventory'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "returnInventory", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'Summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "summary", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'GetItems'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "getItems", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'GetItem'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "getItem", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'GetTransactions'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "getTransactions", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'ImportStock'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "importStock", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'ReserveStock'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "reserveStock", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'ReleaseStock'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "releaseStock", null);
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'AdjustStock'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "adjustStock", null);
exports.InventoryGrpcController = InventoryGrpcController = InventoryGrpcController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [product_service_1.OriginProductService])
], InventoryGrpcController);
//# sourceMappingURL=inventory.grpc.controller.js.map