import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaymentMethodEntity } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodRepository {
  private paymentRepo: Repository<PaymentMethodEntity>;

  constructor(@Inject('DATABASE_CONNECTION') private dataSource: DataSource) {
    this.paymentRepo = this.dataSource.getRepository(PaymentMethodEntity);
  }

  async findByUserId(userId: number): Promise<PaymentMethodEntity[]> {
    return await this.paymentRepo.find({ where: { user_id: userId } });
  }

  async findById(id: number): Promise<PaymentMethodEntity | null> {
    return await this.paymentRepo.findOne({ where: { id } });
  }

  async createPaymentMethod(data: Partial<PaymentMethodEntity>): Promise<PaymentMethodEntity> {
    const payment = this.paymentRepo.create(data);
    return await this.paymentRepo.save(payment);
  }

  async updatePaymentMethod(id: number, data: Partial<PaymentMethodEntity>): Promise<PaymentMethodEntity | null> {
    await this.paymentRepo.update(id, data);
    return await this.findById(id);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.paymentRepo.delete(id);
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<void> {
    // Reset all payment methods for this user to non-default
    await this.paymentRepo.update({ user_id: userId }, { is_default: 0 });
    // Set the specified payment method as default
    await this.paymentRepo.update(paymentMethodId, { is_default: 1 });
  }

  async getDefaultPaymentMethod(userId: number): Promise<PaymentMethodEntity | null> {
    return await this.paymentRepo.findOne({ where: { user_id: userId, is_default: 1 } });
  }
}
