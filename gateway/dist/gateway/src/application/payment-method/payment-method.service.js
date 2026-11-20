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
exports.PaymentMethodService = void 0;
const common_1 = require("@nestjs/common");
const contacts_grpc_client_1 = require("../../infrastructure/grpc/contacts-grpc.client");
let PaymentMethodService = class PaymentMethodService {
    constructor(contactsClient) {
        this.contactsClient = contactsClient;
    }
    async getAvailablePaymentMethods(userId) {
        const response = await this.contactsClient.getAvailablePaymentMethods({ userId });
        return response.paymentMethods || [];
    }
    async getAccountPaymentSettings(userId) {
        const response = await this.contactsClient.getAccountPaymentSettings({ userId });
        return this.fromGrpcSettings(response);
    }
    async updateAccountPaymentSettings(userId, settings) {
        try {
            const response = await this.contactsClient.updateAccountPaymentSettings({
                userId,
                settingsJson: JSON.stringify(settings),
            });
            return this.fromGrpcSettings(response);
        }
        catch (error) {
            if (typeof error === 'object' && error !== null && 'code' in error && error.code === 5) {
                throw new common_1.BadRequestException('Account not found. Please create an account first.');
            }
            throw error;
        }
    }
    fromGrpcSettings(response) {
        return {
            prepayment_enabled: response.prepaymentEnabled,
            cash_on_delivery_enabled: response.cashOnDeliveryEnabled,
            payment_settings: response.paymentSettingsJson
                ? JSON.parse(response.paymentSettingsJson)
                : undefined,
        };
    }
};
exports.PaymentMethodService = PaymentMethodService;
exports.PaymentMethodService = PaymentMethodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contacts_grpc_client_1.ContactsGrpcClient])
], PaymentMethodService);
//# sourceMappingURL=payment-method.service.js.map