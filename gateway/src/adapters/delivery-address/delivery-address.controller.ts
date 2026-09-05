import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DeliveryAddressService, DeliveryAddress } from '../../application/delivery-address/delivery-address.service';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';

@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(private readonly contactsClient: ContactsGrpcClient) {}

  @Get('user/:userId')
  async getAddresses(@Param('userId') userId: string): Promise<DeliveryAddress[]> {
    const response: any = await this.contactsClient.getDeliveryAddresses({ userId: parseInt(userId) });
    return response.addresses || [];
  }

  @Get(':id')
  async getAddress(@Param('id') id: string): Promise<DeliveryAddress | null> {
    const response: any = await this.contactsClient.getDeliveryAddress({ id: parseInt(id) });
    return response.address || null;
  }

  @Get('default/:userId')
  async getDefaultAddress(@Param('userId') userId: string): Promise<DeliveryAddress | null> {
    const response: any = await this.contactsClient.getDefaultDeliveryAddress({ userId: parseInt(userId) });
    return response.address || null;
  }

  @Post('user/:userId')
  async createAddress(
    @Param('userId') userId: string,
    @Body() data: Omit<DeliveryAddress, 'id' | 'user_id'>,
  ): Promise<DeliveryAddress> {
    const response: any = await this.contactsClient.createDeliveryAddress({ userId: parseInt(userId), ...data });
    return response.address;
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() data: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    const response: any = await this.contactsClient.updateDeliveryAddress({ id: parseInt(id), ...data });
    return response.address;
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
    await this.contactsClient.setDefaultDeliveryAddress({ userId: parseInt(userId), addressId: parseInt(addressId) });
  }
}
