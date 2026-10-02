import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DeliveryAddress } from '../../application/delivery-address/delivery-address.service';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';
import * as ContactsModel from '../../../../packages/contracts/model/contacts/contacts.model';

@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(private readonly contactsClient: ContactsGrpcClient) {}

  @Get('user/:userId')
  async getAddresses(@Param('userId') userId: string): Promise<DeliveryAddress[]> {
    const response: ContactsModel.IGetDeliveryAddressesResponse =
      await this.contactsClient.getDeliveryAddresses({ userId: parseInt(userId, 10) });
    return (response.addresses || []).map((address) => this.toDeliveryAddress(address));
  }

  @Get(':id')
  async getAddress(@Param('id') id: string): Promise<DeliveryAddress | null> {
    const response: ContactsModel.IGetDeliveryAddressResponse =
      await this.contactsClient.getDeliveryAddress({ id: parseInt(id, 10) });
    return response.address ? this.toDeliveryAddress(response.address) : null;
  }

  @Get('default/:userId')
  async getDefaultAddress(@Param('userId') userId: string): Promise<DeliveryAddress | null> {
    const response: ContactsModel.IGetDefaultDeliveryAddressResponse =
      await this.contactsClient.getDefaultDeliveryAddress({ userId: parseInt(userId, 10) });
    return response.address ? this.toDeliveryAddress(response.address) : null;
  }

  @Post('user/:userId')
  async createAddress(
    @Param('userId') userId: string,
    @Body() data: Omit<DeliveryAddress, 'id' | 'user_id'>,
  ): Promise<DeliveryAddress> {
    const request: ContactsModel.ICreateDeliveryAddressRequest = {
      userId: parseInt(userId, 10),
      recipientName: data.recipient_name ?? '',
      phone: data.phone ?? '',
      address: data.street_address ?? '',
      city: data.province ?? '',
      district: data.district ?? '',
      ward: data.ward ?? '',
      isDefault: data.is_default === 1,
    };
    const response: ContactsModel.ICreateDeliveryAddressResponse =
      await this.contactsClient.createDeliveryAddress(request);
    return this.toDeliveryAddress(response.address);
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() data: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    const request: ContactsModel.IUpdateDeliveryAddressRequest = {
      id: parseInt(id, 10),
      ...(data.recipient_name !== undefined && { recipientName: data.recipient_name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.street_address !== undefined && { address: data.street_address }),
      ...(data.province !== undefined && { city: data.province }),
      ...(data.district !== undefined && { district: data.district }),
      ...(data.ward !== undefined && { ward: data.ward }),
      ...(data.is_default !== undefined && { isDefault: data.is_default === 1 }),
    };
    const response: ContactsModel.IUpdateDeliveryAddressResponse =
      await this.contactsClient.updateDeliveryAddress(request);
    return this.toDeliveryAddress(response.address);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    await this.contactsClient.deleteDeliveryAddress({ id: parseInt(id) });
  }

  @Put('default/:userId/:addressId')
  async setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    await this.contactsClient.setDefaultDeliveryAddress({
      userId: parseInt(userId, 10),
      addressId: parseInt(addressId, 10),
    });
  }

  private toDeliveryAddress(address: ContactsModel.IDeliveryAddress): DeliveryAddress {
    return {
      id: address.id,
      user_id: address.userId,
      recipient_name: address.recipientName,
      phone: address.phone,
      province: address.city,
      district: address.district,
      ward: address.ward,
      street_address: address.address,
      is_default: address.isDefault ? 1 : 0,
    };
  }
}
