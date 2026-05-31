import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import * as ContactsModel from "../../model/contacts/contacts.model";
export interface IGrpcContactsService {
    getUserProfile(input?: ContactsModel.IGetUserProfileRequest, metadata?: Metadata): Observable<ContactsModel.IGetUserProfileResponse>;
    updateUserProfile(input?: ContactsModel.IUpdateUserProfileRequest, metadata?: Metadata): Observable<ContactsModel.IUpdateUserProfileResponse>;
    getDeliveryAddresses(input?: ContactsModel.IGetDeliveryAddressesRequest, metadata?: Metadata): Observable<ContactsModel.IGetDeliveryAddressesResponse>;
    getDeliveryAddress(input?: ContactsModel.IGetDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.IGetDeliveryAddressResponse>;
    getDefaultDeliveryAddress(input?: ContactsModel.IGetDefaultDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.IGetDefaultDeliveryAddressResponse>;
    createDeliveryAddress(input?: ContactsModel.ICreateDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.ICreateDeliveryAddressResponse>;
    updateDeliveryAddress(input?: ContactsModel.IUpdateDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.IUpdateDeliveryAddressResponse>;
    deleteDeliveryAddress(input?: ContactsModel.IDeleteDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.IDeleteDeliveryAddressResponse>;
    setDefaultDeliveryAddress(input?: ContactsModel.ISetDefaultDeliveryAddressRequest, metadata?: Metadata): Observable<ContactsModel.ISetDefaultDeliveryAddressResponse>;
    getPaymentMethods(input?: ContactsModel.IGetPaymentMethodsRequest, metadata?: Metadata): Observable<ContactsModel.IGetPaymentMethodsResponse>;
    getPaymentMethod(input?: ContactsModel.IGetPaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.IGetPaymentMethodResponse>;
    getDefaultPaymentMethod(input?: ContactsModel.IGetDefaultPaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.IGetDefaultPaymentMethodResponse>;
    createPaymentMethod(input?: ContactsModel.ICreatePaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.ICreatePaymentMethodResponse>;
    updatePaymentMethod(input?: ContactsModel.IUpdatePaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.IUpdatePaymentMethodResponse>;
    deletePaymentMethod(input?: ContactsModel.IDeletePaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.IDeletePaymentMethodResponse>;
    setDefaultPaymentMethod(input?: ContactsModel.ISetDefaultPaymentMethodRequest, metadata?: Metadata): Observable<ContactsModel.ISetDefaultPaymentMethodResponse>;
}
