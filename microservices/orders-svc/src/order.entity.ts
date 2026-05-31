import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { OrderLineEntity } from './order-line.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    unsigned: true,
  })
  id!: string;

  @Index('idx_user_id')
  @Column({
    type: 'bigint',
    unsigned: true,
  })
  userId!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalAmount!: number;

  @Column({
    length: 50,
    default: 'pending',
  })
  status!: string;

  @OneToMany(() => OrderLineEntity, (orderLine) => orderLine.order, {
    cascade: true,
    eager: true,
  })
  orderLines?: OrderLineEntity[];

  @Column({
    type: 'text',
    nullable: true,
  })
  shippingAddress?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  fcmToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
