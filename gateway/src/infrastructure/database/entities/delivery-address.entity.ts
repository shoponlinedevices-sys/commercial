import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('tbl_delivery_address')
export class DeliveryAddressEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'user_id' })
  user_id?: number;

  @Column({ name: 'recipient_name', type: 'varchar', length: 100 })
  recipient_name?: string;

  @Column({ type: 'varchar', length: 20 })
  phone?: string;

  @Column({ type: 'varchar', length: 100 })
  province?: string;

  @Column({ type: 'varchar', length: 100 })
  district?: string;

  @Column({ type: 'varchar', length: 100 })
  ward?: string;

  @Column({ name: 'street_address', type: 'varchar', length: 255 })
  street_address?: string;

  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  is_default?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at?: Date;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'user_id' })
  account?: AccountEntity;
}
