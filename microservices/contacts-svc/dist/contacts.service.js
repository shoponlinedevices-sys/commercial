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
const common_2 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_profile_entity_1 = require("./user-profile.entity");
const user_entity_1 = require("./user.entity");
const delivery_address_entity_1 = require("./delivery-address.entity");
const payment_method_entity_1 = require("./payment-method.entity");
const history_log_entity_1 = require("./history-log.entity");
let ContactsService = class ContactsService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    get userProfileRepository() {
        return this.dataSource.getRepository(user_profile_entity_1.UserProfileEntity);
    }
    get userRepository() {
        return this.dataSource.getRepository(user_entity_1.User);
    }
    get deliveryAddressRepository() {
        return this.dataSource.getRepository(delivery_address_entity_1.DeliveryAddressEntity);
    }
    get paymentMethodRepository() {
        return this.dataSource.getRepository(payment_method_entity_1.PaymentMethodEntity);
    }
    async getHistoryLogs(limit = 200) {
        return this.dataSource.getRepository(history_log_entity_1.HistoryLogEntity).find({
            order: { createdAt: 'DESC' },
            take: Math.min(limit, 500),
        });
    }
    async getUserProfile(userId) {
        const userProfile = await this.userProfileRepository.findOne({
            where: { id: userId },
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User profile not found');
        }
        return {
            userProfile: {
                id: user.id,
                username: userProfile?.username || user.username,
                fullName: userProfile?.fullName || user.fullName,
                phone: userProfile?.phone || null,
                email: userProfile?.email || user.email,
                avatar: userProfile?.avatar || null,
            },
        };
    }
    async updateUserProfile(data) {
        let userProfile = await this.userProfileRepository.findOne({
            where: { id: data.userId },
        });
        if (!userProfile) {
            const user = await this.userRepository.findOne({ where: { id: data.userId } });
            if (!user) {
                throw new Error('User profile not found');
            }
            userProfile = this.userProfileRepository.create({
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                phone: null,
                email: user.email,
                avatar: null,
            });
        }
        if (data.fullName)
            userProfile.fullName = data.fullName;
        if (data.phone)
            userProfile.phone = data.phone;
        if (data.email)
            userProfile.email = data.email;
        if (data.avatar)
            userProfile.avatar = data.avatar;
        const updated = await this.userProfileRepository.save(userProfile);
        return { userProfile: updated };
    }
    async getDeliveryAddresses(userId) {
        const addresses = await this.deliveryAddressRepository.find({
            where: { userId },
        });
        return { addresses };
    }
    async getDeliveryAddress(id) {
        const address = await this.deliveryAddressRepository.findOne({
            where: { id },
        });
        if (!address) {
            throw new Error('Delivery address not found');
        }
        return { address };
    }
    async getDefaultDeliveryAddress(userId) {
        const address = await this.deliveryAddressRepository.findOne({
            where: { userId, isDefault: true },
        });
        if (!address) {
            throw new Error('Default delivery address not found');
        }
        return { address };
    }
    async createDeliveryAddress(data) {
        const address = this.deliveryAddressRepository.create(data);
        const saved = await this.deliveryAddressRepository.save(address);
        return { address: saved };
    }
    async updateDeliveryAddress(data) {
        const address = await this.deliveryAddressRepository.findOne({
            where: { id: data.id },
        });
        if (!address) {
            throw new Error('Delivery address not found');
        }
        if (data.recipientName)
            address.recipientName = data.recipientName;
        if (data.phone)
            address.phone = data.phone;
        if (data.address)
            address.address = data.address;
        if (data.city)
            address.city = data.city;
        if (data.district)
            address.district = data.district;
        if (data.ward)
            address.ward = data.ward;
        if (data.isDefault !== undefined)
            address.isDefault = data.isDefault;
        const updated = await this.deliveryAddressRepository.save(address);
        return { address: updated };
    }
    async deleteDeliveryAddress(id) {
        const address = await this.deliveryAddressRepository.findOne({
            where: { id },
        });
        if (!address) {
            throw new Error('Delivery address not found');
        }
        await this.deliveryAddressRepository.remove(address);
        return { success: true };
    }
    async setDefaultDeliveryAddress(userId, addressId) {
        await this.deliveryAddressRepository.update({ userId }, { isDefault: false });
        const address = await this.deliveryAddressRepository.findOne({
            where: { id: addressId, userId },
        });
        if (!address) {
            throw new Error('Delivery address not found');
        }
        address.isDefault = true;
        await this.deliveryAddressRepository.save(address);
        return { success: true };
    }
    async getPaymentMethods(userId) {
        const paymentMethods = await this.paymentMethodRepository.find({
            where: { userId },
        });
        return { paymentMethods };
    }
    async getPaymentMethod(id) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id },
        });
        if (!paymentMethod) {
            throw new Error('Payment method not found');
        }
        return { paymentMethod };
    }
    async getDefaultPaymentMethod(userId) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { userId, isDefault: true },
        });
        if (!paymentMethod) {
            throw new Error('Default payment method not found');
        }
        return { paymentMethod };
    }
    async createPaymentMethod(data) {
        const paymentMethod = this.paymentMethodRepository.create(data);
        const saved = await this.paymentMethodRepository.save(paymentMethod);
        return { paymentMethod: saved };
    }
    async updatePaymentMethod(data) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: data.id },
        });
        if (!paymentMethod) {
            throw new Error('Payment method not found');
        }
        if (data.type)
            paymentMethod.type = data.type;
        if (data.provider)
            paymentMethod.provider = data.provider;
        if (data.accountNumber)
            paymentMethod.accountNumber = data.accountNumber;
        if (data.accountName)
            paymentMethod.accountName = data.accountName;
        if (data.isDefault !== undefined)
            paymentMethod.isDefault = data.isDefault;
        const updated = await this.paymentMethodRepository.save(paymentMethod);
        return { paymentMethod: updated };
    }
    async deletePaymentMethod(id) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id },
        });
        if (!paymentMethod) {
            throw new Error('Payment method not found');
        }
        await this.paymentMethodRepository.remove(paymentMethod);
        return { success: true };
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        await this.paymentMethodRepository.update({ userId }, { isDefault: false });
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: { id: paymentMethodId, userId },
        });
        if (!paymentMethod) {
            throw new Error('Payment method not found');
        }
        paymentMethod.isDefault = true;
        await this.paymentMethodRepository.save(paymentMethod);
        return { success: true };
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('DATA_SOURCE')),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map