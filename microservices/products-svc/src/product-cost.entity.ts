import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { SupplierEntity } from './supplier.entity';

@Entity('tbl_product_cost')
export class ProductCostEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: string;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @Column({ name: 'supplier_id', type: 'int', nullable: true })
  supplierId: number | null;

  @Column({ name: 'import_price', type: 'decimal', precision: 15, scale: 2 })
  importPrice: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'shipping_fee', type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingFee: string;

  @Column({ name: 'other_fee', type: 'decimal', precision: 15, scale: 2, default: 0 })
  otherFee: string;

  @Column({ name: 'import_date', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  importDate: Date;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => ProductEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => SupplierEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SupplierEntity | null;
}
