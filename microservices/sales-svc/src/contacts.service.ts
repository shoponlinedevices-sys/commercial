import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcContactsService } from '../../../packages/contracts/grpc/interface/grpc-contacts.service';
import * as ContactsModel from '../../../packages/contracts/model/contacts/contacts.model';

@Injectable()
export class ContactsService {
  private grpcContactsService: IGrpcContactsService;

  constructor(@Inject('CONTACTS_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.grpcContactsService = this.client.getService<IGrpcContactsService>('ContactsService');
  }

  // User Profile
  async getUserProfile(userId: number): Promise<ContactsModel.IGetUserProfileResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getUserProfile({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch user profile from contacts-svc');
    }
  }

  async updateUserProfile(request: ContactsModel.IUpdateUserProfileRequest): Promise<ContactsModel.IUpdateUserProfileResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.updateUserProfile(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to update user profile in contacts-svc');
    }
  }

  // Delivery Address
  async getDeliveryAddresses(userId: number): Promise<ContactsModel.IGetDeliveryAddressesResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getDeliveryAddresses({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch delivery addresses from contacts-svc');
    }
  }

  async getDeliveryAddress(id: number): Promise<ContactsModel.IGetDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getDeliveryAddress({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch delivery address from contacts-svc');
    }
  }

  async getDefaultDeliveryAddress(userId: number): Promise<ContactsModel.IGetDefaultDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getDefaultDeliveryAddress({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch default delivery address from contacts-svc');
    }
  }

  async createDeliveryAddress(request: ContactsModel.ICreateDeliveryAddressRequest): Promise<ContactsModel.ICreateDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.createDeliveryAddress(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to create delivery address in contacts-svc');
    }
  }

  async updateDeliveryAddress(request: ContactsModel.IUpdateDeliveryAddressRequest): Promise<ContactsModel.IUpdateDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.updateDeliveryAddress(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to update delivery address in contacts-svc');
    }
  }

  async deleteDeliveryAddress(id: number): Promise<ContactsModel.IDeleteDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.deleteDeliveryAddress({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to delete delivery address in contacts-svc');
    }
  }

  async setDefaultDeliveryAddress(userId: number, addressId: number): Promise<ContactsModel.ISetDefaultDeliveryAddressResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.setDefaultDeliveryAddress({ userId, addressId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to set default delivery address in contacts-svc');
    }
  }

  // Payment Method
  async getPaymentMethods(userId: number): Promise<ContactsModel.IGetPaymentMethodsResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getPaymentMethods({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch payment methods from contacts-svc');
    }
  }

  async getPaymentMethod(id: number): Promise<ContactsModel.IGetPaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getPaymentMethod({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch payment method from contacts-svc');
    }
  }

  async getDefaultPaymentMethod(userId: number): Promise<ContactsModel.IGetDefaultPaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.getDefaultPaymentMethod({ userId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to fetch default payment method from contacts-svc');
    }
  }

  async createPaymentMethod(request: ContactsModel.ICreatePaymentMethodRequest): Promise<ContactsModel.ICreatePaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.createPaymentMethod(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to create payment method in contacts-svc');
    }
  }

  async updatePaymentMethod(request: ContactsModel.IUpdatePaymentMethodRequest): Promise<ContactsModel.IUpdatePaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.updatePaymentMethod(request)
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to update payment method in contacts-svc');
    }
  }

  async deletePaymentMethod(id: number): Promise<ContactsModel.IDeletePaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.deletePaymentMethod({ id })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to delete payment method in contacts-svc');
    }
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<ContactsModel.ISetDefaultPaymentMethodResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcContactsService.setDefaultPaymentMethod({ userId, paymentMethodId })
      );
      return response;
    } catch (error) {
      console.error('Error calling contacts-svc:', error);
      throw new Error('Failed to set default payment method in contacts-svc');
    }
  }
}
