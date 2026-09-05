import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentMethodService, PaymentMethod, AccountPaymentSettings } from '../../application/payment-method/payment-method.service';
import { ContactsGrpcClient } from '../../infrastructure/grpc/contacts-grpc.client';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(
    private readonly paymentMethodService: PaymentMethodService,
    private readonly contactsClient: ContactsGrpcClient,
  ) {}

  @Get('user/:userId')
  async getPaymentMethods(@Param('userId') userId: string): Promise<PaymentMethod[]> {
    const response: any = await this.contactsClient.getPaymentMethods({ userId: parseInt(userId) });
    return response.paymentMethods || [];
  }

  @Get(':id')
  async getPaymentMethod(@Param('id') id: string): Promise<PaymentMethod | null> {
    const response: any = await this.contactsClient.getPaymentMethod({ id: parseInt(id) });
    return response.paymentMethod || null;
  }

  @Get('default/:userId')
  async getDefaultPaymentMethod(@Param('userId') userId: string): Promise<PaymentMethod | null> {
    const response: any = await this.contactsClient.getDefaultPaymentMethod({ userId: parseInt(userId) });
    return response.paymentMethod || null;
  }

  @Get('available/:userId')
  async getAvailablePaymentMethods(@Param('userId') userId: string): Promise<string[]> {
    return await this.paymentMethodService.getAvailablePaymentMethods(parseInt(userId));
  }

  @Get('settings/:userId')
  async getAccountPaymentSettings(@Param('userId') userId: string): Promise<AccountPaymentSettings> {
    return await this.paymentMethodService.getAccountPaymentSettings(parseInt(userId));
  }

  @Put('settings/:userId')
  async updateAccountPaymentSettings(
    @Param('userId') userId: string,
    @Body() data: Partial<AccountPaymentSettings>,
  ): Promise<AccountPaymentSettings> {
    return await this.paymentMethodService.updateAccountPaymentSettings(parseInt(userId), data);
  }

  @Post('user/:userId')
  async createPaymentMethod(
    @Param('userId') userId: string,
    @Body() data: Omit<PaymentMethod, 'id' | 'user_id'>,
  ): Promise<PaymentMethod> {
    const response: any = await this.contactsClient.createPaymentMethod({ userId: parseInt(userId), ...data });
    return response.paymentMethod;
  }

  @Put(':id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() data: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    const response: any = await this.contactsClient.updatePaymentMethod({ id: parseInt(id), ...data });
    return response.paymentMethod;
  }

  @Delete(':id')
  async deletePaymentMethod(@Param('id') id: string): Promise<void> {
    await this.contactsClient.deletePaymentMethod({ id: parseInt(id) });
  }

  @Put('default/:userId/:paymentMethodId')
  async setDefaultPaymentMethod(
    @Param('userId') userId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ): Promise<void> {
    await this.contactsClient.setDefaultPaymentMethod({ userId: parseInt(userId), paymentMethodId: parseInt(paymentMethodId) });
  }
}
