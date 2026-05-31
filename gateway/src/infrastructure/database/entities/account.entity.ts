import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { DeliveryAddressEntity } from './delivery-address.entity';
import { PaymentMethodEntity } from './payment-method.entity';

@Entity('tbl_account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username?: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  password_hash?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ name: 'full_name', type: 'varchar', length: 100, nullable: true })
  full_name?: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role?: string;

  @Column({ type: 'tinyint', default: 1 })
  status?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @Column({ name: 'prepayment_enabled', type: 'tinyint', default: 1 })
  prepayment_enabled?: number;

  @Column({ name: 'cash_on_delivery_enabled', type: 'tinyint', default: 1 })
  cash_on_delivery_enabled?: number;

  @Column({ name: 'payment_settings', type: 'json', nullable: true })
  payment_settings?: any;

  @OneToMany(() => CartEntity, (cart) => cart.account)
  carts?: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.account)
  orders?: OrderEntity[];

  @OneToMany(() => DeliveryAddressEntity, (address) => address.account)
  deliveryAddresses?: DeliveryAddressEntity[];

  @OneToMany(() => PaymentMethodEntity, (payment) => payment.account)
  paymentMethods?: PaymentMethodEntity[];
}
