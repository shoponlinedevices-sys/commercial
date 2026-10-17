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
exports.DeliveryAddressEntity = void 0;
const typeorm_1 = require("typeorm");
const account_entity_1 = require("./account.entity");
let DeliveryAddressEntity = class DeliveryAddressEntity {
};
exports.DeliveryAddressEntity = DeliveryAddressEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DeliveryAddressEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], DeliveryAddressEntity.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_name', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "recipient_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'street_address', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DeliveryAddressEntity.prototype, "street_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], DeliveryAddressEntity.prototype, "is_default", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DeliveryAddressEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DeliveryAddressEntity.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => account_entity_1.AccountEntity),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", account_entity_1.AccountEntity)
], DeliveryAddressEntity.prototype, "account", void 0);
exports.DeliveryAddressEntity = DeliveryAddressEntity = __decorate([
    (0, typeorm_1.Entity)('tbl_delivery_address')
], DeliveryAddressEntity);
//# sourceMappingURL=delivery-address.entity.js.map