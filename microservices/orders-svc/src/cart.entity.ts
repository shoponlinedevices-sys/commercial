import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { CartLineEntity } from './cart-line.entity';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_user_id')
  @Column()
  userId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice: string;

  @Column({ default: 1 })
  status: number;

  @OneToMany(() => CartLineEntity, (cartLine) => cartLine.cart, {
    cascade: true,
    eager: true,
  })
  cartLines?: CartLineEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
