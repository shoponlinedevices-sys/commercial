import { ClientGrpc } from '@nestjs/microservices';
import * as ContactsModel from '../../../packages/contracts/model/contacts/contacts.model';
export declare class ContactsService {
    private client;
    private grpcContactsService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    getUserProfile(userId: number): Promise<ContactsModel.IGetUserProfileResponse>;
    updateUserProfile(request: ContactsModel.IUpdateUserProfileRequest): Promise<ContactsModel.IUpdateUserProfileResponse>;
    getDeliveryAddresses(userId: number): Promise<ContactsModel.IGetDeliveryAddressesResponse>;
    getDeliveryAddress(id: number): Promise<ContactsModel.IGetDeliveryAddressResponse>;
    getDefaultDeliveryAddress(userId: number): Promise<ContactsModel.IGetDefaultDeliveryAddressResponse>;
    createDeliveryAddress(request: ContactsModel.ICreateDeliveryAddressRequest): Promise<ContactsModel.ICreateDeliveryAddressResponse>;
    updateDeliveryAddress(request: ContactsModel.IUpdateDeliveryAddressRequest): Promise<ContactsModel.IUpdateDeliveryAddressResponse>;
    deleteDeliveryAddress(id: number): Promise<ContactsModel.IDeleteDeliveryAddressResponse>;
    setDefaultDeliveryAddress(userId: number, addressId: number): Promise<ContactsModel.ISetDefaultDeliveryAddressResponse>;
    getPaymentMethods(userId: number): Promise<ContactsModel.IGetPaymentMethodsResponse>;
    getPaymentMethod(id: number): Promise<ContactsModel.IGetPaymentMethodResponse>;
    getDefaultPaymentMethod(userId: number): Promise<ContactsModel.IGetDefaultPaymentMethodResponse>;
    createPaymentMethod(request: ContactsModel.ICreatePaymentMethodRequest): Promise<ContactsModel.ICreatePaymentMethodResponse>;
    updatePaymentMethod(request: ContactsModel.IUpdatePaymentMethodRequest): Promise<ContactsModel.IUpdatePaymentMethodResponse>;
    deletePaymentMethod(id: number): Promise<ContactsModel.IDeletePaymentMethodResponse>;
    setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<ContactsModel.ISetDefaultPaymentMethodResponse>;
}
