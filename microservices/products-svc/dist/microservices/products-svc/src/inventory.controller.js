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
var InventoryController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
let InventoryController = InventoryController_1 = class InventoryController {
    constructor(productService) {
        this.productService = productService;
        this.logger = new common_1.Logger(InventoryController_1.name);
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
    async getSummary() {
        return this.productService.getInventorySummary();
    }
    async getInventory(page = '1', limit = '10', search = '', category = '', status = '') {
        return this.productService.getInventoryList({
            page: Number(page),
            limit: Number(limit),
            search,
            category,
            status,
        });
    }
    async getTransactions(page = '1', limit = '20', productId, type) {
        return this.productService.getInventoryTransactions({
            page: Number(page),
            limit: Number(limit),
            productId: productId ? Number(productId) : undefined,
            type,
        });
    }
    async getInventoryDetail(productId) {
        return this.productService.getInventoryDetail(Number(productId));
    }
    async importStock(body) {
        return this.productService.importInventory(this.normalizeCreatedBy(body));
    }
    async reserveStock(body) {
        return this.productService.reserveInventory(this.normalizeCreatedBy(body));
    }
    async releaseStock(body) {
        return this.productService.releaseInventory(this.normalizeCreatedBy(body));
    }
    async saleStock(body) {
        return this.productService.saleInventory(this.normalizeCreatedBy(body));
    }
    async returnStock(body) {
        return this.productService.returnInventory(this.normalizeCreatedBy(body));
    }
    async adjustStock(body) {
        return this.productService.adjustInventory(this.normalizeCreatedBy(body));
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventory", null);
__decorate([
    (0, common_1.Get)('transactions'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('productId')),
    __param(3, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)(':productId'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getInventoryDetail", null);
__decorate([
    (0, common_1.Post)('import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "importStock", null);
__decorate([
    (0, common_1.Post)('reserve'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "reserveStock", null);
__decorate([
    (0, common_1.Post)('release'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "releaseStock", null);
__decorate([
    (0, common_1.Post)('sale'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "saleStock", null);
__decorate([
    (0, common_1.Post)('return'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "returnStock", null);
__decorate([
    (0, common_1.Post)('adjustments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustStock", null);
exports.InventoryController = InventoryController = InventoryController_1 = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map