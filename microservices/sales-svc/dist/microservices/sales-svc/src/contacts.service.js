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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let ContactsService = class ContactsService {
    constructor(client) {
        this.client = client;
    }
    onModuleInit() {
        this.grpcContactsService = this.client.getService('ContactsService');
    }
    async getUserProfile(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getUserProfile({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch user profile from contacts-svc');
        }
    }
    async updateUserProfile(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.updateUserProfile(request));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to update user profile in contacts-svc');
        }
    }
    async getDeliveryAddresses(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getDeliveryAddresses({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch delivery addresses from contacts-svc');
        }
    }
    async getDeliveryAddress(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getDeliveryAddress({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch delivery address from contacts-svc');
        }
    }
    async getDefaultDeliveryAddress(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getDefaultDeliveryAddress({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch default delivery address from contacts-svc');
        }
    }
    async createDeliveryAddress(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.createDeliveryAddress(request));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to create delivery address in contacts-svc');
        }
    }
    async updateDeliveryAddress(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.updateDeliveryAddress(request));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to update delivery address in contacts-svc');
        }
    }
    async deleteDeliveryAddress(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.deleteDeliveryAddress({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to delete delivery address in contacts-svc');
        }
    }
    async setDefaultDeliveryAddress(userId, addressId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.setDefaultDeliveryAddress({ userId, addressId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to set default delivery address in contacts-svc');
        }
    }
    async getPaymentMethods(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getPaymentMethods({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch payment methods from contacts-svc');
        }
    }
    async getPaymentMethod(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getPaymentMethod({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch payment method from contacts-svc');
        }
    }
    async getDefaultPaymentMethod(userId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.getDefaultPaymentMethod({ userId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to fetch default payment method from contacts-svc');
        }
    }
    async createPaymentMethod(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.createPaymentMethod(request));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to create payment method in contacts-svc');
        }
    }
    async updatePaymentMethod(request) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.updatePaymentMethod(request));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to update payment method in contacts-svc');
        }
    }
    async deletePaymentMethod(id) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.deletePaymentMethod({ id }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to delete payment method in contacts-svc');
        }
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.grpcContactsService.setDefaultPaymentMethod({ userId, paymentMethodId }));
            return response;
        }
        catch (error) {
            console.error('Error calling contacts-svc:', error);
            throw new Error('Failed to set default payment method in contacts-svc');
        }
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CONTACTS_PACKAGE')),
    __metadata("design:paramtypes", [Object])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map