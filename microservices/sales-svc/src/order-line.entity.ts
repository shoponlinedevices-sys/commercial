import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('tbl_order_lines')
export class OrderLineEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    unsigned: true,
  })
  id!: string;

  @Index('idx_order_id')
  @Column({
    name: 'order_id',
    type: 'bigint',
    unsigned: true,
  })
  orderId!: string;

  @ManyToOne('OrderEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order?: any;

  @Index('idx_product_id')
  @Column({
    name: 'product_id',
    type: 'bigint',
    unsigned: true,
  })
  productId!: string;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice!: string;

  @Column({
    type: 'int',
    default: 1,
  })
  quantity!: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalPrice!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}