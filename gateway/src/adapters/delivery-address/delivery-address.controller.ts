import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DeliveryAddressService, DeliveryAddress } from '../../application/delivery-address/delivery-address.service';

@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(private readonly deliveryAddressService: DeliveryAddressService) {}

  @Get('user/:userId')
  async getAddresses(@Param('userId') userId: string): Promise<DeliveryAddress[]> {
    return await this.deliveryAddressService.getAddresses(parseInt(userId));
  }

  @Get(':id')
  async getAddress(@Param('id') id: string): Promise<DeliveryAddress | null> {
    return await this.deliveryAddressService.getAddress(parseInt(id));
  }

  @Get('default/:userId')
  async getDefaultAddress(@Param('userId') userId: string): Promise<DeliveryAddress | null> {
    return await this.deliveryAddressService.getDefaultAddress(parseInt(userId));
  }

  @Post('user/:userId')
  async createAddress(
    @Param('userId') userId: string,
    @Body() data: Omit<DeliveryAddress, 'id' | 'user_id'>,
  ): Promise<DeliveryAddress> {
    return await this.deliveryAddressService.createAddress(parseInt(userId), data);
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() data: Partial<DeliveryAddress>,
  ): Promise<DeliveryAddress> {
    return await this.deliveryAddressService.updateAddress(parseInt(id), data);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    await this.deliveryAddressService.deleteAddress(parseInt(id));
  }

  @Put('default/:userId/:addressId')
  async setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    await this.deliveryAddressService.setDefaultAddress(parseInt(userId), parseInt(addressId));
  }
}
