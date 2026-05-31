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
exports.CartEntity = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./account.entity");
const cart_line_entity_1 = require("./cart-line.entity");
let CartEntity = class CartEntity {
};
exports.CartEntity = CartEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CartEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'user_id',
        type: 'int',
    }),
    __metadata("design:type", Number)
], CartEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.AccountEntity, (account) => account.carts, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", account_entity_1.AccountEntity)
], CartEntity.prototype, "account", void 0);
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
], CartEntity.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'tinyint',
        default: 1,
        comment: '1=active, 2=ordered, 0=removed',
    }),
    __metadata("design:type", Number)
], CartEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], CartEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], CartEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_line_entity_1.CartLineEntity, (cartLine) => cartLine.cart),
    __metadata("design:type", Array)
], CartEntity.prototype, "cartLines", void 0);
exports.CartEntity = CartEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_cart')
], CartEntity);
//# sourceMappingURL=cart.entity.js.map