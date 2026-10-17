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
exports.PaymentMethodController = void 0;
const common_1 = require("@nestjs/common");
const payment_method_service_1 = require("../../application/payment-method/payment-method.service");
const contacts_grpc_client_1 = require("../../infrastructure/grpc/contacts-grpc.client");
let PaymentMethodController = class PaymentMethodController {
    constructor(paymentMethodService, contactsClient) {
        this.paymentMethodService = paymentMethodService;
        this.contactsClient = contactsClient;
    }
    async getPaymentMethods(userId) {
        const response = await this.contactsClient.getPaymentMethods({ userId: parseInt(userId) });
        return response.paymentMethods || [];
    }
    async getPaymentMethod(id) {
        const response = await this.contactsClient.getPaymentMethod({ id: parseInt(id) });
        return response.paymentMethod || null;
    }
    async getDefaultPaymentMethod(userId) {
        const response = await this.contactsClient.getDefaultPaymentMethod({ userId: parseInt(userId) });
        return response.paymentMethod || null;
    }
    async getAvailablePaymentMethods(userId) {
        return await this.paymentMethodService.getAvailablePaymentMethods(parseInt(userId));
    }
    async getAccountPaymentSettings(userId) {
        return await this.paymentMethodService.getAccountPaymentSettings(parseInt(userId));
    }
    async updateAccountPaymentSettings(userId, data) {
        return await this.paymentMethodService.updateAccountPaymentSettings(parseInt(userId), data);
    }
    async createPaymentMethod(userId, data) {
        const response = await this.contactsClient.createPaymentMethod(Object.assign({ userId: parseInt(userId) }, data));
        return response.paymentMethod;
    }
    async updatePaymentMethod(id, data) {
        const response = await this.contactsClient.updatePaymentMethod(Object.assign({ id: parseInt(id) }, data));
        return response.paymentMethod;
    }
    async deletePaymentMethod(id) {
        await this.contactsClient.deletePaymentMethod({ id: parseInt(id) });
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        await this.contactsClient.setDefaultPaymentMethod({ userId: parseInt(userId), paymentMethodId: parseInt(paymentMethodId) });
    }
};
exports.PaymentMethodController = PaymentMethodController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "getPaymentMethod", null);
__decorate([
    (0, common_1.Get)('default/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "getDefaultPaymentMethod", null);
__decorate([
    (0, common_1.Get)('available/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "getAvailablePaymentMethods", null);
__decorate([
    (0, common_1.Get)('settings/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "getAccountPaymentSettings", null);
__decorate([
    (0, common_1.Put)('settings/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "updateAccountPaymentSettings", null);
__decorate([
    (0, common_1.Post)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "createPaymentMethod", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "updatePaymentMethod", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "deletePaymentMethod", null);
__decorate([
    (0, common_1.Put)('default/:userId/:paymentMethodId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('paymentMethodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentMethodController.prototype, "setDefaultPaymentMethod", null);
exports.PaymentMethodController = PaymentMethodController = __decorate([
    (0, common_1.Controller)('payment-method'),
    __metadata("design:paramtypes", [payment_method_service_1.PaymentMethodService,
        contacts_grpc_client_1.ContactsGrpcClient])
], PaymentMethodController);
//# sourceMappingURL=payment-method.controller.js.map