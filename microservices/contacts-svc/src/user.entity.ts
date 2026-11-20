import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tbl_account')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  status: number;

  @Column({ name: 'prepayment_enabled', type: 'tinyint', default: 1 })
  prepaymentEnabled: number;

  @Column({ name: 'cash_on_delivery_enabled', type: 'tinyint', default: 1 })
  cashOnDeliveryEnabled: number;

  @Column({ name: 'payment_settings', type: 'json', nullable: true })
  paymentSettings: {
    show_only_prepayment?: boolean;
    show_both_options?: boolean;
  } | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
