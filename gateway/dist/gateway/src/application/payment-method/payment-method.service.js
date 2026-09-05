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
const payment_method_repository_1 = require("../../infrastructure/database/repositories/payment-method.repository");
const account_repository_1 = require("../../infrastructure/database/repositories/account.repository");
let PaymentMethodService = class PaymentMethodService {
    constructor(paymentMethodRepository, accountRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.accountRepository = accountRepository;
    }
    async getPaymentMethods(userId) {
        return await this.paymentMethodRepository.findByUserId(userId);
    }
    async getAvailablePaymentMethods(userId) {
        const account = await this.accountRepository.findById(userId);
        if (!account) {
            return ['cash', 'card', 'bank_transfer', 'momo', 'zalopay'];
        }
        const settings = account.payment_settings || { show_only_prepayment: false, show_both_options: true };
        const availableMethods = [];
        if (settings.show_only_prepayment) {
            if (account.prepayment_enabled === 1) {
                availableMethods.push('prepayment');
            }
        }
        else if (settings.show_both_options) {
            if (account.prepayment_enabled === 1) {
                availableMethods.push('prepayment');
            }
            if (account.cash_on_delivery_enabled === 1) {
                availableMethods.push('cash_on_delivery');
            }
        }
        if (availableMethods.length === 0) {
            availableMethods.push('cash', 'card', 'bank_transfer', 'momo', 'zalopay');
        }
        return availableMethods;
    }
    async getAccountPaymentSettings(userId) {
        const account = await this.accountRepository.findById(userId);
        if (!account) {
            return {
                prepayment_enabled: 1,
                cash_on_delivery_enabled: 1,
                payment_settings: {
                    show_only_prepayment: false,
                    show_both_options: true,
                },
            };
        }
        return {
            prepayment_enabled: account.prepayment_enabled,
            cash_on_delivery_enabled: account.cash_on_delivery_enabled,
            payment_settings: account.payment_settings,
        };
    }
    async updateAccountPaymentSettings(userId, settings) {
        const account = await this.accountRepository.findById(userId);
        if (!account) {
            throw new common_1.BadRequestException('Account not found. Please create an account first.');
        }
        const updateData = {};
        if (settings.prepayment_enabled !== undefined) {
            updateData.prepayment_enabled = settings.prepayment_enabled;
        }
        if (settings.cash_on_delivery_enabled !== undefined) {
            updateData.cash_on_delivery_enabled = settings.cash_on_delivery_enabled;
        }
        if (settings.payment_settings !== undefined) {
            updateData.payment_settings = settings.payment_settings;
        }
        await this.accountRepository.update(userId, updateData);
        return await this.getAccountPaymentSettings(userId);
    }
    async getPaymentMethod(id) {
        const payment = await this.paymentMethodRepository.findById(id);
        if (!payment) {
            throw new common_1.BadRequestException('Payment method not found');
        }
        return payment;
    }
    async createPaymentMethod(userId, data) {
        const paymentData = Object.assign(Object.assign({}, data), { user_id: userId });
        const payment = await this.paymentMethodRepository.createPaymentMethod(paymentData);
        const payments = await this.paymentMethodRepository.findByUserId(userId);
        if (payments.length === 1 || data.is_default === 1) {
            await this.paymentMethodRepository.setDefaultPaymentMethod(userId, payment.id);
        }
        return payment;
    }
    async updatePaymentMethod(id, data) {
        const payment = await this.paymentMethodRepository.updatePaymentMethod(id, data);
        if (!payment) {
            throw new common_1.BadRequestException('Payment method not found');
        }
        if (data.is_default === 1) {
            await this.paymentMethodRepository.setDefaultPaymentMethod(payment.user_id, id);
        }
        return payment;
    }
    async deletePaymentMethod(id) {
        const payment = await this.paymentMethodRepository.findById(id);
        if (!payment) {
            throw new common_1.BadRequestException('Payment method not found');
        }
        if (payment.is_default === 1) {
            const userPayments = await this.paymentMethodRepository.findByUserId(payment.user_id);
            if (userPayments.length === 1) {
                throw new common_1.BadRequestException('Cannot delete the only payment method. Please add another payment method first.');
            }
            const otherPayment = userPayments.find(p => p.id !== id);
            if (otherPayment) {
                await this.paymentMethodRepository.setDefaultPaymentMethod(payment.user_id, otherPayment.id);
            }
        }
        await this.paymentMethodRepository.deletePaymentMethod(id);
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        const payment = await this.paymentMethodRepository.findById(paymentMethodId);
        if (!payment || payment.user_id !== userId) {
            throw new common_1.BadRequestException('Payment method not found or does not belong to user');
        }
        await this.paymentMethodRepository.setDefaultPaymentMethod(userId, paymentMethodId);
    }
    async getDefaultPaymentMethod(userId) {
        return await this.paymentMethodRepository.getDefaultPaymentMethod(userId);
    }
};
exports.PaymentMethodService = PaymentMethodService;
exports.PaymentMethodService = PaymentMethodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payment_method_repository_1.PaymentMethodRepository,
        account_repository_1.AccountRepository])
], PaymentMethodService);
//# sourceMappingURL=payment-method.service.js.map