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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAddressRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const delivery_address_entity_1 = require("../entities/delivery-address.entity");
let DeliveryAddressRepository = class DeliveryAddressRepository {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.addressRepo = this.dataSource.getRepository(delivery_address_entity_1.DeliveryAddressEntity);
    }
    async findByUserId(userId) {
        return await this.addressRepo.find({ where: { user_id: userId } });
    }
    async findById(id) {
        return await this.addressRepo.findOne({ where: { id } });
    }
    async createAddress(data) {
        const address = this.addressRepo.create(data);
        return await this.addressRepo.save(address);
    }
    async updateAddress(id, data) {
        await this.addressRepo.update(id, data);
        return await this.findById(id);
    }
    async deleteAddress(id) {
        await this.addressRepo.delete(id);
    }
    async setDefaultAddress(userId, addressId) {
        await this.addressRepo.update({ user_id: userId }, { is_default: 0 });
        await this.addressRepo.update(addressId, { is_default: 1 });
    }
    async getDefaultAddress(userId) {
        return await this.addressRepo.findOne({ where: { user_id: userId, is_default: 1 } });
    }
};
exports.DeliveryAddressRepository = DeliveryAddressRepository;
exports.DeliveryAddressRepository = DeliveryAddressRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DeliveryAddressRepository);
//# sourceMappingURL=delivery-address.repository.js.map