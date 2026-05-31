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
exports.CartLineEntity = void 0;
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("./cart.entity");
const product_entity_1 = require("./product.entity");
let CartLineEntity = class CartLineEntity {
    constructor() {
        this.name = '';
    }
};
exports.CartLineEntity = CartLineEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CartLineEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'product_id',
        type: 'int',
    }),
    __metadata("design:type", Number)
], CartLineEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.ProductEntity, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.ProductEntity)
], CartLineEntity.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 255,
        nullable: false,
        default: '',
    }),
    __metadata("design:type", String)
], CartLineEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cart_id',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Number)
], CartLineEntity.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cart_entity_1.CartEntity, (cart) => cart.cartLines, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'cart_id' }),
    __metadata("design:type", cart_entity_1.CartEntity)
], CartLineEntity.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 1,
    }),
    __metadata("design:type", Number)
], CartLineEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 12,
        scale: 2,
    }),
    __metadata("design:type", String)
], CartLineEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_price',
        type: 'decimal',
        precision: 12,
        scale: 2,
        insert: false,
        update: false,
    }),
    __metadata("design:type", String)
], CartLineEntity.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'tinyint',
        default: 1,
        comment: '1=active, 0=removed',
    }),
    __metadata("design:type", Number)
], CartLineEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], CartLineEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], CartLineEntity.prototype, "updatedAt", void 0);
exports.CartLineEntity = CartLineEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_cart_lines')
], CartLineEntity);
//# sourceMappingURL=cart-line.entity.js.map