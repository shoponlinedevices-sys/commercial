import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CartLineEntity } from './cart-line.entity';

@Entity('tbl_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price?: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'oldPrice' })
  oldPrice?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  badge?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  sku?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  moq?: string;

  @Column({ type: 'text', nullable: true, name: 'image' })
  image?: string;

  @Column({ type: 'int', nullable: true, name: 'category' })
  category?: number;

  @Column({ type: 'tinyint', default: 1 })
  status?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @OneToMany(() => CartLineEntity, (cartLine) => cartLine.product)
  cartLines?: CartLineEntity[];
}
