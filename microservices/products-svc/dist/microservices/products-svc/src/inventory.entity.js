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
exports.InventoryEntity = void 0;
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./product.entity");
let InventoryEntity = class InventoryEntity {
};
exports.InventoryEntity = InventoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', unique: true }),
    __metadata("design:type", Number)
], InventoryEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_on_hand', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryEntity.prototype, "quantityOnHand", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_reserved', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryEntity.prototype, "quantityReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reorder_level', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventoryEntity.prototype, "reorderLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], InventoryEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], InventoryEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => product_entity_1.ProductEntity),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], InventoryEntity.prototype, "product", void 0);
exports.InventoryEntity = InventoryEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_inventory')
], InventoryEntity);
//# sourceMappingURL=inventory.entity.js.map