import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ContactsService } from './contacts.service';

@Controller()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('history-logs')
  async getHistoryLogs(@Query('limit') limit?: string) {
    return this.contactsService.getHistoryLogs(Number(limit) || 200);
  }

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

  @GrpcMethod('ContactsService', 'GetUserProfile')
  getUserProfileGrpc(data: { userId: number }) {
    return this.contactsService.getUserProfile(data.userId);
  }

  @GrpcMethod('ContactsService', 'UpdateUserProfile')
  updateUserProfileGrpc(data: any) {
    return this.contactsService.updateUserProfile(data);
  }

  @GrpcMethod('ContactsService', 'GetDeliveryAddresses')
  getDeliveryAddressesGrpc(data: { userId: number }) {
    return this.contactsService.getDeliveryAddresses(data.userId);
  }

  @GrpcMethod('ContactsService', 'GetDeliveryAddress')
  getDeliveryAddressGrpc(data: { id: number }) {
    return this.contactsService.getDeliveryAddress(data.id);
  }

  @GrpcMethod('ContactsService', 'GetDefaultDeliveryAddress')
  getDefaultDeliveryAddressGrpc(data: { userId: number }) {
    return this.contactsService.getDefaultDeliveryAddress(data.userId);
  }

  @GrpcMethod('ContactsService', 'CreateDeliveryAddress')
  createDeliveryAddressGrpc(data: any) {
    return this.contactsService.createDeliveryAddress(data);
  }

  @GrpcMethod('ContactsService', 'UpdateDeliveryAddress')
  updateDeliveryAddressGrpc(data: any) {
    return this.contactsService.updateDeliveryAddress(data);
  }

  @GrpcMethod('ContactsService', 'DeleteDeliveryAddress')
  deleteDeliveryAddressGrpc(data: { id: number }) {
    return this.contactsService.deleteDeliveryAddress(data.id);
  }

  @GrpcMethod('ContactsService', 'SetDefaultDeliveryAddress')
  setDefaultDeliveryAddressGrpc(data: { userId: number; addressId: number }) {
    return this.contactsService.setDefaultDeliveryAddress(data.userId, data.addressId);
  }

  @GrpcMethod('ContactsService', 'GetPaymentMethods')
  getPaymentMethodsGrpc(data: { userId: number }) {
    return this.contactsService.getPaymentMethods(data.userId);
  }

  @GrpcMethod('ContactsService', 'GetPaymentMethod')
  getPaymentMethodGrpc(data: { id: number }) {
    return this.contactsService.getPaymentMethod(data.id);
  }

  @GrpcMethod('ContactsService', 'GetDefaultPaymentMethod')
  getDefaultPaymentMethodGrpc(data: { userId: number }) {
    return this.contactsService.getDefaultPaymentMethod(data.userId);
  }

  @GrpcMethod('ContactsService', 'CreatePaymentMethod')
  createPaymentMethodGrpc(data: any) {
    return this.contactsService.createPaymentMethod(data);
  }

  @GrpcMethod('ContactsService', 'UpdatePaymentMethod')
  updatePaymentMethodGrpc(data: any) {
    return this.contactsService.updatePaymentMethod(data);
  }

  @GrpcMethod('ContactsService', 'DeletePaymentMethod')
  deletePaymentMethodGrpc(data: { id: number }) {
    return this.contactsService.deletePaymentMethod(data.id);
  }

  @GrpcMethod('ContactsService', 'SetDefaultPaymentMethod')
  setDefaultPaymentMethodGrpc(data: { userId: number; paymentMethodId: number }) {
    return this.contactsService.setDefaultPaymentMethod(data.userId, data.paymentMethodId);
  }
}
