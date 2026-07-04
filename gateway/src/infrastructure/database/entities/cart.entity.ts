import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { AccountEntity } from './account.entity';
import { ProductEntity } from './product.entity';
import { CartLineEntity } from './cart-line.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    name: 'user_id',
    type: 'int',
  })
  userId?: number;

  @ManyToOne(() => AccountEntity, (account) => account.carts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  account?: AccountEntity;

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
    comment: '1=active, 2=ordered, 0=removed',
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

  @OneToMany(() => CartLineEntity, (cartLine) => cartLine.cart)
  cartLines?: CartLineEntity[];
}