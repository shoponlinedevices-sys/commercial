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

@Entity('cart_lines')
export class CartLineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_cart_id')
  @Column()
  cartId: number;

  @ManyToOne('CartEntity', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart?: any;

  @Index('idx_product_id')
  @Column()
  productId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  @Column({ default: 1 })
  status: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
