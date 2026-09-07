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
exports.ContactsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const contacts_service_1 = require("./contacts.service");
let ContactsController = class ContactsController {
    constructor(contactsService) {
        this.contactsService = contactsService;
    }
    async getHistoryLogs(limit) {
        return this.contactsService.getHistoryLogs(Number(limit) || 200);
    }
    async getUserProfile(userId) {
        return this.contactsService.getUserProfile(parseInt(userId));
    }
    async updateUserProfile(userId, body) {
        return this.contactsService.updateUserProfile({
            userId: parseInt(userId),
            ...body,
        });
    }
    async getDeliveryAddresses(userId) {
        return this.contactsService.getDeliveryAddresses(parseInt(userId));
    }
    async getDeliveryAddress(id) {
        return this.contactsService.getDeliveryAddress(parseInt(id));
    }
    async getDefaultDeliveryAddress(userId) {
        return this.contactsService.getDefaultDeliveryAddress(parseInt(userId));
    }
    async createDeliveryAddress(userId, body) {
        return this.contactsService.createDeliveryAddress({
            userId: parseInt(userId),
            ...body,
        });
    }
    async updateDeliveryAddress(id, body) {
        return this.contactsService.updateDeliveryAddress({
            id: parseInt(id),
            ...body,
        });
    }
    async deleteDeliveryAddress(id) {
        return this.contactsService.deleteDeliveryAddress(parseInt(id));
    }
    async setDefaultDeliveryAddress(userId, addressId) {
        return this.contactsService.setDefaultDeliveryAddress(parseInt(userId), parseInt(addressId));
    }
    async getPaymentMethods(userId) {
        return this.contactsService.getPaymentMethods(parseInt(userId));
    }
    async getPaymentMethod(id) {
        return this.contactsService.getPaymentMethod(parseInt(id));
    }
    async getDefaultPaymentMethod(userId) {
        return this.contactsService.getDefaultPaymentMethod(parseInt(userId));
    }
    async createPaymentMethod(userId, body) {
        return this.contactsService.createPaymentMethod({
            userId: parseInt(userId),
            ...body,
        });
    }
    async updatePaymentMethod(id, body) {
        return this.contactsService.updatePaymentMethod({
            id: parseInt(id),
            ...body,
        });
    }
    async deletePaymentMethod(id) {
        return this.contactsService.deletePaymentMethod(parseInt(id));
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        return this.contactsService.setDefaultPaymentMethod(parseInt(userId), parseInt(paymentMethodId));
    }
    getUserProfileGrpc(data) {
        return this.contactsService.getUserProfile(data.userId);
    }
    updateUserProfileGrpc(data) {
        return this.contactsService.updateUserProfile(data);
    }
    getDeliveryAddressesGrpc(data) {
        return this.contactsService.getDeliveryAddresses(data.userId);
    }
    getDeliveryAddressGrpc(data) {
        return this.contactsService.getDeliveryAddress(data.id);
    }
    getDefaultDeliveryAddressGrpc(data) {
        return this.contactsService.getDefaultDeliveryAddress(data.userId);
    }
    createDeliveryAddressGrpc(data) {
        return this.contactsService.createDeliveryAddress(data);
    }
    updateDeliveryAddressGrpc(data) {
        return this.contactsService.updateDeliveryAddress(data);
    }
    deleteDeliveryAddressGrpc(data) {
        return this.contactsService.deleteDeliveryAddress(data.id);
    }
    setDefaultDeliveryAddressGrpc(data) {
        return this.contactsService.setDefaultDeliveryAddress(data.userId, data.addressId);
    }
    getPaymentMethodsGrpc(data) {
        return this.contactsService.getPaymentMethods(data.userId);
    }
    getPaymentMethodGrpc(data) {
        return this.contactsService.getPaymentMethod(data.id);
    }
    getDefaultPaymentMethodGrpc(data) {
        return this.contactsService.getDefaultPaymentMethod(data.userId);
    }
    createPaymentMethodGrpc(data) {
        return this.contactsService.createPaymentMethod(data);
    }
    updatePaymentMethodGrpc(data) {
        return this.contactsService.updatePaymentMethod(data);
    }
    deletePaymentMethodGrpc(data) {
        return this.contactsService.deletePaymentMethod(data.id);
    }
    setDefaultPaymentMethodGrpc(data) {
        return this.contactsService.setDefaultPaymentMethod(data.userId, data.paymentMethodId);
    }
};
exports.ContactsController = ContactsController;
__decorate([
    (0, common_1.Get)('history-logs'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getHistoryLogs", null);
__decorate([
    (0, common_1.Get)('user-profile/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Put)('user-profile/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Get)('delivery-address/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getDeliveryAddresses", null);
__decorate([
    (0, common_1.Get)('delivery-address/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getDeliveryAddress", null);
__decorate([
    (0, common_1.Get)('delivery-address/default/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getDefaultDeliveryAddress", null);
__decorate([
    (0, common_1.Post)('delivery-address/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "createDeliveryAddress", null);
__decorate([
    (0, common_1.Put)('delivery-address/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "updateDeliveryAddress", null);
__decorate([
    (0, common_1.Delete)('delivery-address/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "deleteDeliveryAddress", null);
__decorate([
    (0, common_1.Put)('delivery-address/default/:userId/:addressId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "setDefaultDeliveryAddress", null);
__decorate([
    (0, common_1.Get)('payment-method/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)('payment-method/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getPaymentMethod", null);
__decorate([
    (0, common_1.Get)('payment-method/default/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "getDefaultPaymentMethod", null);
__decorate([
    (0, common_1.Post)('payment-method/user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "createPaymentMethod", null);
__decorate([
    (0, common_1.Put)('payment-method/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "updatePaymentMethod", null);
__decorate([
    (0, common_1.Delete)('payment-method/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "deletePaymentMethod", null);
__decorate([
    (0, common_1.Put)('payment-method/default/:userId/:paymentMethodId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('paymentMethodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContactsController.prototype, "setDefaultPaymentMethod", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetUserProfile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getUserProfileGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'UpdateUserProfile'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "updateUserProfileGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetDeliveryAddresses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getDeliveryAddressesGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetDefaultDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getDefaultDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'CreateDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "createDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'UpdateDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "updateDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'DeleteDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "deleteDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'SetDefaultDeliveryAddress'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "setDefaultDeliveryAddressGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetPaymentMethods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getPaymentMethodsGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetPaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getPaymentMethodGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'GetDefaultPaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getDefaultPaymentMethodGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'CreatePaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "createPaymentMethodGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'UpdatePaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "updatePaymentMethodGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'DeletePaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "deletePaymentMethodGrpc", null);
__decorate([
    (0, microservices_1.GrpcMethod)('ContactsService', 'SetDefaultPaymentMethod'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "setDefaultPaymentMethodGrpc", null);
exports.ContactsController = ContactsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService])
], ContactsController);
//# sourceMappingURL=contacts.controller.js.map