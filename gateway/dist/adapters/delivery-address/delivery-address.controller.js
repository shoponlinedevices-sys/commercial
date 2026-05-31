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
exports.DeliveryAddressController = void 0;
const common_1 = require("@nestjs/common");
const delivery_address_service_1 = require("../../application/delivery-address/delivery-address.service");
let DeliveryAddressController = class DeliveryAddressController {
    constructor(deliveryAddressService) {
        this.deliveryAddressService = deliveryAddressService;
    }
    async getAddresses(userId) {
        return await this.deliveryAddressService.getAddresses(parseInt(userId));
    }
    async getAddress(id) {
        return await this.deliveryAddressService.getAddress(parseInt(id));
    }
    async getDefaultAddress(userId) {
        return await this.deliveryAddressService.getDefaultAddress(parseInt(userId));
    }
    async createAddress(userId, data) {
        return await this.deliveryAddressService.createAddress(parseInt(userId), data);
    }
    async updateAddress(id, data) {
        return await this.deliveryAddressService.updateAddress(parseInt(id), data);
    }
    async deleteAddress(id) {
        await this.deliveryAddressService.deleteAddress(parseInt(id));
    }
    async setDefaultAddress(userId, addressId) {
        await this.deliveryAddressService.setDefaultAddress(parseInt(userId), parseInt(addressId));
    }
};
exports.DeliveryAddressController = DeliveryAddressController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "getAddress", null);
__decorate([
    (0, common_1.Get)('default/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "getDefaultAddress", null);
__decorate([
    (0, common_1.Post)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "createAddress", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.Put)('default/:userId/:addressId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeliveryAddressController.prototype, "setDefaultAddress", null);
exports.DeliveryAddressController = DeliveryAddressController = __decorate([
    (0, common_1.Controller)('delivery-address'),
    __metadata("design:paramtypes", [delivery_address_service_1.DeliveryAddressService])
], DeliveryAddressController);
//# sourceMappingURL=delivery-address.controller.js.map