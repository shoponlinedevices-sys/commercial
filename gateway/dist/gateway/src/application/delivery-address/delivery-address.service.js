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
exports.DeliveryAddressService = void 0;
const common_1 = require("@nestjs/common");
const delivery_address_repository_1 = require("../../infrastructure/database/repositories/delivery-address.repository");
let DeliveryAddressService = class DeliveryAddressService {
    constructor(deliveryAddressRepository) {
        this.deliveryAddressRepository = deliveryAddressRepository;
    }
    async getAddresses(userId) {
        return await this.deliveryAddressRepository.findByUserId(userId);
    }
    async getAddress(id) {
        const address = await this.deliveryAddressRepository.findById(id);
        if (!address) {
            throw new common_1.BadRequestException('Address not found');
        }
        return address;
    }
    async createAddress(userId, data) {
        const addressData = Object.assign(Object.assign({}, data), { user_id: userId });
        const address = await this.deliveryAddressRepository.createAddress(addressData);
        const addresses = await this.deliveryAddressRepository.findByUserId(userId);
        if (addresses.length === 1 || data.is_default === 1) {
            await this.deliveryAddressRepository.setDefaultAddress(userId, address.id);
        }
        return address;
    }
    async updateAddress(id, data) {
        const address = await this.deliveryAddressRepository.updateAddress(id, data);
        if (!address) {
            throw new common_1.BadRequestException('Address not found');
        }
        if (data.is_default === 1) {
            await this.deliveryAddressRepository.setDefaultAddress(address.user_id, id);
        }
        return address;
    }
    async deleteAddress(id) {
        const address = await this.deliveryAddressRepository.findById(id);
        if (!address) {
            throw new common_1.BadRequestException('Address not found');
        }
        await this.deliveryAddressRepository.deleteAddress(id);
    }
    async setDefaultAddress(userId, addressId) {
        const address = await this.deliveryAddressRepository.findById(addressId);
        if (!address || address.user_id !== userId) {
            throw new common_1.BadRequestException('Address not found or does not belong to user');
        }
        await this.deliveryAddressRepository.setDefaultAddress(userId, addressId);
    }
    async getDefaultAddress(userId) {
        return await this.deliveryAddressRepository.getDefaultAddress(userId);
    }
};
exports.DeliveryAddressService = DeliveryAddressService;
exports.DeliveryAddressService = DeliveryAddressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [delivery_address_repository_1.DeliveryAddressRepository])
], DeliveryAddressService);
//# sourceMappingURL=delivery-address.service.js.map