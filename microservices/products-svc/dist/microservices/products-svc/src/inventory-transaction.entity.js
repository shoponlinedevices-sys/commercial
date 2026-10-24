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
exports.InventoryTransactionEntity = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let InventoryTransactionEntity = class InventoryTransactionEntity {
};
exports.InventoryTransactionEntity = InventoryTransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_type' }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', nullable: true }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_before', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "quantityBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_after', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "quantityAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], InventoryTransactionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], InventoryTransactionEntity.prototype, "product", void 0);
exports.InventoryTransactionEntity = InventoryTransactionEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_inventory_transactions')
], InventoryTransactionEntity);
//# sourceMappingURL=inventory-transaction.entity.js.map