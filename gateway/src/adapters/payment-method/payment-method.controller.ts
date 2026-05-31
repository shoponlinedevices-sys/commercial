import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PaymentMethodService, PaymentMethod, AccountPaymentSettings } from '../../application/payment-method/payment-method.service';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get('user/:userId')
  async getPaymentMethods(@Param('userId') userId: string): Promise<PaymentMethod[]> {
    return await this.paymentMethodService.getPaymentMethods(parseInt(userId));
  }

  @Get(':id')
  async getPaymentMethod(@Param('id') id: string): Promise<PaymentMethod | null> {
    return await this.paymentMethodService.getPaymentMethod(parseInt(id));
  }

  @Get('default/:userId')
  async getDefaultPaymentMethod(@Param('userId') userId: string): Promise<PaymentMethod | null> {
    return await this.paymentMethodService.getDefaultPaymentMethod(parseInt(userId));
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
    return await this.paymentMethodService.createPaymentMethod(parseInt(userId), data);
  }

  @Put(':id')
  async updatePaymentMethod(
    @Param('id') id: string,
    @Body() data: Partial<PaymentMethod>,
  ): Promise<PaymentMethod> {
    return await this.paymentMethodService.updatePaymentMethod(parseInt(id), data);
  }

  @Delete(':id')
  async deletePaymentMethod(@Param('id') id: string): Promise<void> {
    await this.paymentMethodService.deletePaymentMethod(parseInt(id));
  }

  @Put('default/:userId/:paymentMethodId')
  async setDefaultPaymentMethod(
    @Param('userId') userId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ): Promise<void> {
    await this.paymentMethodService.setDefaultPaymentMethod(parseInt(userId), parseInt(paymentMethodId));
  }
}
