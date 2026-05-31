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
const contacts_service_1 = require("./contacts.service");
let ContactsController = class ContactsController {
    constructor(contactsService) {
        this.contactsService = contactsService;
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
};
exports.ContactsController = ContactsController;
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
exports.ContactsController = ContactsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService])
], ContactsController);
//# sourceMappingURL=contacts.controller.js.map