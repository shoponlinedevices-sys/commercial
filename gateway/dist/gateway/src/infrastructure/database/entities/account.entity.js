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
exports.AccountEntity = void 0;
const typeorm_1 = require("typeorm");
const cart_entity_1 = require("./cart.entity");
const order_entity_1 = require("./order.entity");
const delivery_address_entity_1 = require("./delivery-address.entity");
const payment_method_entity_1 = require("./payment-method.entity");
let AccountEntity = class AccountEntity {
};
exports.AccountEntity = AccountEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AccountEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], AccountEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AccountEntity.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AccountEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], AccountEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], AccountEntity.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['user', 'admin'], default: 'user' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AccountEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AccountEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prepayment_enabled', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "prepayment_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cash_on_delivery_enabled', type: 'tinyint', default: 1 }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "cash_on_delivery_enabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_settings', type: 'json', nullable: true }),
    __metadata("design:type", Object)
], AccountEntity.prototype, "payment_settings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_entity_1.CartEntity, (cart) => cart.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "carts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.OrderEntity, (order) => order.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_address_entity_1.DeliveryAddressEntity, (address) => address.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "deliveryAddresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_method_entity_1.PaymentMethodEntity, (payment) => payment.account),
    __metadata("design:type", Array)
], AccountEntity.prototype, "paymentMethods", void 0);
exports.AccountEntity = AccountEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_account')
], AccountEntity);
//# sourceMappingURL=account.entity.js.map