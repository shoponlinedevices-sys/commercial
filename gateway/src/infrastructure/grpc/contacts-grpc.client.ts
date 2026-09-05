import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IGrpcContactsService } from '../../../../packages/contracts/grpc/interface/grpc-contacts.service';

@Injectable()
export class ContactsGrpcClient implements OnModuleInit {
  private contactsService!: IGrpcContactsService;

  constructor(@Inject('GRPC_CONTACTS_SERVICE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.contactsService = this.client.getService<IGrpcContactsService>('ContactsService');
  }

  getUserProfile(data: any) { return firstValueFrom(this.contactsService.getUserProfile(data)); }
  updateUserProfile(data: any) { return firstValueFrom(this.contactsService.updateUserProfile(data)); }
  getDeliveryAddresses(data: any) { return firstValueFrom(this.contactsService.getDeliveryAddresses(data)); }
  getDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.getDeliveryAddress(data)); }
  getDefaultDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.getDefaultDeliveryAddress(data)); }
  createDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.createDeliveryAddress(data)); }
  updateDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.updateDeliveryAddress(data)); }
  deleteDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.deleteDeliveryAddress(data)); }
  setDefaultDeliveryAddress(data: any) { return firstValueFrom(this.contactsService.setDefaultDeliveryAddress(data)); }
  getPaymentMethods(data: any) { return firstValueFrom(this.contactsService.getPaymentMethods(data)); }
  getPaymentMethod(data: any) { return firstValueFrom(this.contactsService.getPaymentMethod(data)); }
  getDefaultPaymentMethod(data: any) { return firstValueFrom(this.contactsService.getDefaultPaymentMethod(data)); }
  createPaymentMethod(data: any) { return firstValueFrom(this.contactsService.createPaymentMethod(data)); }
  updatePaymentMethod(data: any) { return firstValueFrom(this.contactsService.updatePaymentMethod(data)); }
  deletePaymentMethod(data: any) { return firstValueFrom(this.contactsService.deletePaymentMethod(data)); }
  setDefaultPaymentMethod(data: any) { return firstValueFrom(this.contactsService.setDefaultPaymentMethod(data)); }
}
