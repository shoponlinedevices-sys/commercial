import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    getUserProfile(userId: string): Promise<{
        userProfile: import("./user-profile.entity").UserProfileEntity;
    }>;
    updateUserProfile(userId: string, body: any): Promise<{
        userProfile: import("./user-profile.entity").UserProfileEntity;
    }>;
    getDeliveryAddresses(userId: string): Promise<{
        addresses: import("./delivery-address.entity").DeliveryAddressEntity[];
    }>;
    getDeliveryAddress(id: string): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    getDefaultDeliveryAddress(userId: string): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    createDeliveryAddress(userId: string, body: any): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    updateDeliveryAddress(id: string, body: any): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    deleteDeliveryAddress(id: string): Promise<{
        success: boolean;
    }>;
    setDefaultDeliveryAddress(userId: string, addressId: string): Promise<{
        success: boolean;
    }>;
    getPaymentMethods(userId: string): Promise<{
        paymentMethods: import("./payment-method.entity").PaymentMethodEntity[];
    }>;
    getPaymentMethod(id: string): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    getDefaultPaymentMethod(userId: string): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    createPaymentMethod(userId: string, body: any): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    updatePaymentMethod(id: string, body: any): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    deletePaymentMethod(id: string): Promise<{
        success: boolean;
    }>;
    setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<{
        success: boolean;
    }>;
}
