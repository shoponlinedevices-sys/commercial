import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // User Profile
  @Get('user-profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    return this.contactsService.getUserProfile(parseInt(userId));
  }

  @Put('user-profile/:userId')
  async updateUserProfile(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.contactsService.updateUserProfile({
      userId: parseInt(userId),
      ...body,
    });
  }

  // Delivery Address
  @Get('delivery-address/user/:userId')
  async getDeliveryAddresses(@Param('userId') userId: string) {
    return this.contactsService.getDeliveryAddresses(parseInt(userId));
  }

  @Get('delivery-address/:id')
  async getDeliveryAddress(@Param('id') id: string) {
    return this.contactsService.getDeliveryAddress(parseInt(id));
  }

  @Get('delivery-address/default/:userId')
  async getDefaultDeliveryAddress(@Param('userId') userId: string) {
    return this.contactsService.getDefaultDeliveryAddress(parseInt(userId));
  }

  @Post('delivery-address/user/:userId')
  async createDeliveryAddress(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.contactsService.createDeliveryAddress({
      userId: parseInt(userId),
      ...body,
    });
  }

  @Put('delivery-address/:id')
  async updateDeliveryAddress(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.contactsService.updateDeliveryAddress({
      id: parseInt(id),
      ...body,
    });
  }

  @Delete('delivery-address/:id')
  async deleteDeliveryAddress(@Param('id') id: string) {
    return this.contactsService.deleteDeliveryAddress(parseInt(id));
  }

  @Put('delivery-address/default/:userId/:addressId')
  async setDefaultDeliveryAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.contactsService.setDefaultDeliveryAddress(
      parseInt(userId),
      parseInt(addressId),
    );
  }

  // Payment Method
  @Get('payment-method/user/:userId')
  async getPaymentMethods(@Param('userId') userId: string) {
    return this.contactsService.getPaymentMethods(parseInt(userId));
  }

  @Get('payment-method/:id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.contactsService.getPaymentMethod(parseInt(id));
  }

  @Get('payment-method/default/:userId')
  async getDefaultPaymentMethod(@Param('userId') userId: string) {
    return this.contactsService.getDefaultPaymentMethod(parseInt(userId));
  }

  @Post('payment-method/user/:userId')
  async createPaymentMethod(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.contactsService.createPaymentMethod({
      userId: parseInt(userId),
      ...body,
    });
  }

  @Put('payment-method/:id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.contactsService.updatePaymentMethod({
      id: parseInt(id),
      ...body,
    });
  }

  @Delete('payment-method/:id')
  async deletePaymentMethod(@Param('id') id: string) {
    return this.contactsService.deletePaymentMethod(parseInt(id));
  }

  @Put('payment-method/default/:userId/:paymentMethodId')
  async setDefaultPaymentMethod(
    @Param('userId') userId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    return this.contactsService.setDefaultPaymentMethod(
      parseInt(userId),
      parseInt(paymentMethodId),
    );
  }
}
