import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';

@Entity('tbl_cart_lines')
export class CartLineEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'product_id',
    type: 'int',
  })
  productId?: number;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product?: ProductEntity;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: '',
  })
  name: string = '';

  @Column({
    name: 'cart_id',
    type: 'int',
    nullable: true,
  })
  cartId?: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartLines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_id' })
  cart?: CartEntity;

  @Column({
    type: 'int',
    default: 1,
  })
  quantity?: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  unitPrice?: string;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 12,
    scale: 2,
    insert: false,
    update: false,
  })
  totalPrice?: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '1=active, 0=removed',
  })
  status?: number;

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