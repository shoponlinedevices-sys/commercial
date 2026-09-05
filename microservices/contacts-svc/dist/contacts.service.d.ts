import { DataSource } from 'typeorm';
import { UserProfileEntity } from './user-profile.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentMethodEntity } from './payment-method.entity';
export declare class ContactsService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    private get userProfileRepository();
    private get userRepository();
    private get deliveryAddressRepository();
    private get paymentMethodRepository();
    getUserProfile(userId: number): Promise<{
        userProfile: {
            id: number;
            username: string;
            fullName: string;
            phone: string;
            email: string;
            avatar: string;
        };
    }>;
    updateUserProfile(data: {
        userId: number;
        fullName?: string;
        phone?: string;
        email?: string;
        avatar?: string;
    }): Promise<{
        userProfile: UserProfileEntity;
    }>;
    getDeliveryAddresses(userId: number): Promise<{
        addresses: DeliveryAddressEntity[];
    }>;
    getDeliveryAddress(id: number): Promise<{
        address: DeliveryAddressEntity;
    }>;
    getDefaultDeliveryAddress(userId: number): Promise<{
        address: DeliveryAddressEntity;
    }>;
    createDeliveryAddress(data: {
        userId: number;
        recipientName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        isDefault: boolean;
    }): Promise<{
        address: DeliveryAddressEntity;
    }>;
    updateDeliveryAddress(data: {
        id: number;
        recipientName?: string;
        phone?: string;
        address?: string;
        city?: string;
        district?: string;
        ward?: string;
        isDefault?: boolean;
    }): Promise<{
        address: DeliveryAddressEntity;
    }>;
    deleteDeliveryAddress(id: number): Promise<{
        success: boolean;
    }>;
    setDefaultDeliveryAddress(userId: number, addressId: number): Promise<{
        success: boolean;
    }>;
    getPaymentMethods(userId: number): Promise<{
        paymentMethods: PaymentMethodEntity[];
    }>;
    getPaymentMethod(id: number): Promise<{
        paymentMethod: PaymentMethodEntity;
    }>;
    getDefaultPaymentMethod(userId: number): Promise<{
        paymentMethod: PaymentMethodEntity;
    }>;
    createPaymentMethod(data: {
        userId: number;
        type: string;
        provider: string;
        accountNumber: string;
        accountName: string;
        isDefault: boolean;
    }): Promise<{
        paymentMethod: PaymentMethodEntity;
    }>;
    updatePaymentMethod(data: {
        id: number;
        type?: string;
        provider?: string;
        accountNumber?: string;
        accountName?: string;
        isDefault?: boolean;
    }): Promise<{
        paymentMethod: PaymentMethodEntity;
    }>;
    deletePaymentMethod(id: number): Promise<{
        success: boolean;
    }>;
    setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<{
        success: boolean;
    }>;
}
