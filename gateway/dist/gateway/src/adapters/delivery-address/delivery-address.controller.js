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
const contacts_grpc_client_1 = require("../../infrastructure/grpc/contacts-grpc.client");
let DeliveryAddressController = class DeliveryAddressController {
    constructor(contactsClient) {
        this.contactsClient = contactsClient;
    }
    async getAddresses(userId) {
        const response = await this.contactsClient.getDeliveryAddresses({ userId: parseInt(userId, 10) });
        return (response.addresses || []).map((address) => this.toDeliveryAddress(address));
    }
    async getAddress(id) {
        const response = await this.contactsClient.getDeliveryAddress({ id: parseInt(id, 10) });
        return response.address ? this.toDeliveryAddress(response.address) : null;
    }
    async getDefaultAddress(userId) {
        const response = await this.contactsClient.getDefaultDeliveryAddress({ userId: parseInt(userId, 10) });
        return response.address ? this.toDeliveryAddress(response.address) : null;
    }
    async createAddress(userId, data) {
        var _a, _b, _c, _d, _e, _f;
        const request = {
            userId: parseInt(userId, 10),
            recipientName: (_a = data.recipient_name) !== null && _a !== void 0 ? _a : '',
            phone: (_b = data.phone) !== null && _b !== void 0 ? _b : '',
            address: (_c = data.street_address) !== null && _c !== void 0 ? _c : '',
            city: (_d = data.province) !== null && _d !== void 0 ? _d : '',
            district: (_e = data.district) !== null && _e !== void 0 ? _e : '',
            ward: (_f = data.ward) !== null && _f !== void 0 ? _f : '',
            isDefault: data.is_default === 1,
        };
        const response = await this.contactsClient.createDeliveryAddress(request);
        return this.toDeliveryAddress(response.address);
    }
    async updateAddress(id, data) {
        const request = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ id: parseInt(id, 10) }, (data.recipient_name !== undefined && { recipientName: data.recipient_name })), (data.phone !== undefined && { phone: data.phone })), (data.street_address !== undefined && { address: data.street_address })), (data.province !== undefined && { city: data.province })), (data.district !== undefined && { district: data.district })), (data.ward !== undefined && { ward: data.ward })), (data.is_default !== undefined && { isDefault: data.is_default === 1 }));
        const response = await this.contactsClient.updateDeliveryAddress(request);
        return this.toDeliveryAddress(response.address);
    }
    async deleteAddress(id) {
        await this.contactsClient.deleteDeliveryAddress({ id: parseInt(id) });
    }
    async setDefaultAddress(userId, addressId) {
        await this.contactsClient.setDefaultDeliveryAddress({
            userId: parseInt(userId, 10),
            addressId: parseInt(addressId, 10),
        });
    }
    toDeliveryAddress(address) {
        return {
            id: address.id,
            user_id: address.userId,
            recipient_name: address.recipientName,
            phone: address.phone,
            province: address.city,
            district: address.district,
            ward: address.ward,
            street_address: address.address,
            is_default: address.isDefault ? 1 : 0,
        };
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
    __metadata("design:paramtypes", [contacts_grpc_client_1.ContactsGrpcClient])
], DeliveryAddressController);
//# sourceMappingURL=delivery-address.controller.js.map