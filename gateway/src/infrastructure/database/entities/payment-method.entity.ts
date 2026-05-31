import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('tbl_payment_method')
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'user_id' })
  user_id?: number;

  @Column({
    type: 'enum',
    enum: ['cash', 'card', 'bank_transfer', 'momo', 'zalopay', 'prepayment', 'cash_on_delivery'],
  })
  type?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  provider?: string;

  @Column({ name: 'card_number', type: 'varchar', length: 50, nullable: true })
  card_number?: string;

  @Column({ name: 'card_holder', type: 'varchar', length: 100, nullable: true })
  card_holder?: string;

  @Column({ name: 'expiry_date', type: 'varchar', length: 10, nullable: true })
  expiry_date?: string;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  is_default?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @ManyToOne(() => AccountEntity)
  account?: AccountEntity;
}
