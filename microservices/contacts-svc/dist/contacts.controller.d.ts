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
    getUserProfileGrpc(data: {
        userId: number;
    }): Promise<{
        userProfile: import("./user-profile.entity").UserProfileEntity;
    }>;
    updateUserProfileGrpc(data: any): Promise<{
        userProfile: import("./user-profile.entity").UserProfileEntity;
    }>;
    getDeliveryAddressesGrpc(data: {
        userId: number;
    }): Promise<{
        addresses: import("./delivery-address.entity").DeliveryAddressEntity[];
    }>;
    getDeliveryAddressGrpc(data: {
        id: number;
    }): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    getDefaultDeliveryAddressGrpc(data: {
        userId: number;
    }): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    createDeliveryAddressGrpc(data: any): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    updateDeliveryAddressGrpc(data: any): Promise<{
        address: import("./delivery-address.entity").DeliveryAddressEntity;
    }>;
    deleteDeliveryAddressGrpc(data: {
        id: number;
    }): Promise<{
        success: boolean;
    }>;
    setDefaultDeliveryAddressGrpc(data: {
        userId: number;
        addressId: number;
    }): Promise<{
        success: boolean;
    }>;
    getPaymentMethodsGrpc(data: {
        userId: number;
    }): Promise<{
        paymentMethods: import("./payment-method.entity").PaymentMethodEntity[];
    }>;
    getPaymentMethodGrpc(data: {
        id: number;
    }): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    getDefaultPaymentMethodGrpc(data: {
        userId: number;
    }): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    createPaymentMethodGrpc(data: any): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    updatePaymentMethodGrpc(data: any): Promise<{
        paymentMethod: import("./payment-method.entity").PaymentMethodEntity;
    }>;
    deletePaymentMethodGrpc(data: {
        id: number;
    }): Promise<{
        success: boolean;
    }>;
    setDefaultPaymentMethodGrpc(data: {
        userId: number;
        paymentMethodId: number;
    }): Promise<{
        success: boolean;
    }>;
}
