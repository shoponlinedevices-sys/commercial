import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { AccountEntity } from './account.entity';

@Entity('tbl_order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId?: number;

  @ManyToOne(() => AccountEntity, (account) => account.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  account?: AccountEntity;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalPrice?: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '1=pending, 2=confirmed, 3=shipped, 4=delivered, 5=cancelled',
  })
  status?: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  fcmToken?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt?: Date;
}
