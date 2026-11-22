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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCostEntity = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
const supplier_entity_1 = require("./supplier.entity");
let ProductCostEntity = class ProductCostEntity {
};
exports.ProductCostEntity = ProductCostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment', { type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], ProductCostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'int' }),
    __metadata("design:type", Number)
], ProductCostEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], ProductCostEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'import_price', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], ProductCostEntity.prototype, "importPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ProductCostEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_fee', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], ProductCostEntity.prototype, "shippingFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_fee', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], ProductCostEntity.prototype, "otherFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'import_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductCostEntity.prototype, "importDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ProductCostEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], ProductCostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], ProductCostEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.SupplierEntity, { nullable: true, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.SupplierEntity)
], ProductCostEntity.prototype, "supplier", void 0);
exports.ProductCostEntity = ProductCostEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_product_cost')
], ProductCostEntity);
//# sourceMappingURL=product-cost.entity.js.map