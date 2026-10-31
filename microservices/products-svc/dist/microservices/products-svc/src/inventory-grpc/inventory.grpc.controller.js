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
        return this.productService.saleInventory(this.normalizeCreatedBy({ ...body.input }));
    }
};
exports.InventoryGrpcController = InventoryGrpcController;
__decorate([
    (0, microservices_1.GrpcMethod)('InventoryService', 'SaleStock'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InventoryGrpcController.prototype, "saleStock", null);
exports.InventoryGrpcController = InventoryGrpcController = InventoryGrpcController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [product_service_1.OriginProductService])
], InventoryGrpcController);
//# sourceMappingURL=inventory.grpc.controller.js.map