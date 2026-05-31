import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    getUserProfile(userId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetUserProfileResponse>;
    updateUserProfile(userId: string, body: any): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IUpdateUserProfileResponse>;
    getDeliveryAddresses(userId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetDeliveryAddressesResponse>;
    getDeliveryAddress(id: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetDeliveryAddressResponse>;
    getDefaultDeliveryAddress(userId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetDefaultDeliveryAddressResponse>;
    createDeliveryAddress(userId: string, body: any): Promise<import("../../../packages/contracts/model/contacts/contacts.model").ICreateDeliveryAddressResponse>;
    updateDeliveryAddress(id: string, body: any): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IUpdateDeliveryAddressResponse>;
    deleteDeliveryAddress(id: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IDeleteDeliveryAddressResponse>;
    setDefaultDeliveryAddress(userId: string, addressId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").ISetDefaultDeliveryAddressResponse>;
    getPaymentMethods(userId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetPaymentMethodsResponse>;
    getPaymentMethod(id: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetPaymentMethodResponse>;
    getDefaultPaymentMethod(userId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IGetDefaultPaymentMethodResponse>;
    createPaymentMethod(userId: string, body: any): Promise<import("../../../packages/contracts/model/contacts/contacts.model").ICreatePaymentMethodResponse>;
    updatePaymentMethod(id: string, body: any): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IUpdatePaymentMethodResponse>;
    deletePaymentMethod(id: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").IDeletePaymentMethodResponse>;
    setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<import("../../../packages/contracts/model/contacts/contacts.model").ISetDefaultPaymentMethodResponse>;
}
