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
exports.PaymentMethodEntity = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./account.entity");
let PaymentMethodEntity = class PaymentMethodEntity {
};
exports.PaymentMethodEntity = PaymentMethodEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentMethodEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], PaymentMethodEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'type',
        type: 'enum',
        enum: ['cash', 'card', 'bank_transfer', 'momo', 'zalopay', 'prepayment', 'cash_on_delivery'],
    }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_number', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "card_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_holder', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "card_holder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_date', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], PaymentMethodEntity.prototype, "expiry_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], PaymentMethodEntity.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PaymentMethodEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], PaymentMethodEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.AccountEntity),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", account_entity_1.AccountEntity)
], PaymentMethodEntity.prototype, "account", void 0);
exports.PaymentMethodEntity = PaymentMethodEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_payment_method')
], PaymentMethodEntity);
//# sourceMappingURL=payment-method.entity.js.map