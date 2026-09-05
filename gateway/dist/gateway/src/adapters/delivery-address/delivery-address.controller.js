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
        const response = await this.contactsClient.getDeliveryAddresses({ userId: parseInt(userId) });
        return response.addresses || [];
    }
    async getAddress(id) {
        const response = await this.contactsClient.getDeliveryAddress({ id: parseInt(id) });
        return response.address || null;
    }
    async getDefaultAddress(userId) {
        const response = await this.contactsClient.getDefaultDeliveryAddress({ userId: parseInt(userId) });
        return response.address || null;
    }
    async createAddress(userId, data) {
        const response = await this.contactsClient.createDeliveryAddress(Object.assign({ userId: parseInt(userId) }, data));
        return response.address;
    }
    async updateAddress(id, data) {
        const response = await this.contactsClient.updateDeliveryAddress(Object.assign({ id: parseInt(id) }, data));
        return response.address;
    }
    async deleteAddress(id) {
        await this.contactsClient.deleteDeliveryAddress({ id: parseInt(id) });
    }
    async setDefaultAddress(userId, addressId) {
        await this.contactsClient.setDefaultDeliveryAddress({ userId: parseInt(userId), addressId: parseInt(addressId) });
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