import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payment_methods')
export class PaymentMethodEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  type: string;

  @Column()
  provider: string;

  @Column()
  accountNumber: string;

  @Column()
  accountName: string;

  @Column({ default: false })
  isDefault: boolean;
}
