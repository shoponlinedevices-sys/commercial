import { Id } from "../common/common.model";

// User Profile
export interface IUserProfile extends Id {
  username: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface IGetUserProfileRequest {
  userId: number;
}

export interface IGetUserProfileResponse {
  userProfile: IUserProfile;
}

export interface IUpdateUserProfileRequest {
  userId: number;
  fullName?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface IUpdateUserProfileResponse {
  userProfile: IUserProfile;
}

// Delivery Address
export interface IDeliveryAddress extends Id {
  userId: number;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface IGetDeliveryAddressesRequest {
  userId: number;
}

export interface IGetDeliveryAddressesResponse {
  addresses: IDeliveryAddress[];
}

export interface IGetDeliveryAddressRequest {
  id: number;
}

export interface IGetDeliveryAddressResponse {
  address: IDeliveryAddress;
}

export interface IGetDefaultDeliveryAddressRequest {
  userId: number;
}

export interface IGetDefaultDeliveryAddressResponse {
  address: IDeliveryAddress;
}

export interface ICreateDeliveryAddressRequest {
  userId: number;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface ICreateDeliveryAddressResponse {
  address: IDeliveryAddress;
}

export interface IUpdateDeliveryAddressRequest {
  id: number;
  recipientName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  isDefault?: boolean;
}

export interface IUpdateDeliveryAddressResponse {
  address: IDeliveryAddress;
}

export interface IDeleteDeliveryAddressRequest {
  id: number;
}

export interface IDeleteDeliveryAddressResponse {
  success: boolean;
}

export interface ISetDefaultDeliveryAddressRequest {
  userId: number;
  addressId: number;
}

export interface ISetDefaultDeliveryAddressResponse {
  success: boolean;
}

// Payment Method
export interface IPaymentMethod extends Id {
  userId: number;
  type: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

export interface IGetPaymentMethodsRequest {
  userId: number;
}

export interface IGetPaymentMethodsResponse {
  paymentMethods: IPaymentMethod[];
}

export interface IGetPaymentMethodRequest {
  id: number;
}

export interface IGetPaymentMethodResponse {
  paymentMethod: IPaymentMethod;
}

export interface IGetDefaultPaymentMethodRequest {
  userId: number;
}

export interface IGetDefaultPaymentMethodResponse {
  paymentMethod: IPaymentMethod;
}

export interface ICreatePaymentMethodRequest {
  userId: number;
  type: string;
  provider: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

export interface ICreatePaymentMethodResponse {
  paymentMethod: IPaymentMethod;
}

export interface IUpdatePaymentMethodRequest {
  id: number;
  type?: string;
  provider?: string;
  accountNumber?: string;
  accountName?: string;
  isDefault?: boolean;
}

export interface IUpdatePaymentMethodResponse {
  paymentMethod: IPaymentMethod;
}

export interface IDeletePaymentMethodRequest {
  id: number;
}

export interface IDeletePaymentMethodResponse {
  success: boolean;
}

export interface ISetDefaultPaymentMethodRequest {
  userId: number;
  paymentMethodId: number;
}

export interface ISetDefaultPaymentMethodResponse {
  success: boolean;
}
