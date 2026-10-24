import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('tbl_inventory_transactions')
export class InventoryTransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'transaction_type' })
  transactionType: 'import' | 'reserve' | 'release' | 'sale' | 'return' | 'adjustment';

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ name: 'reference_type', nullable: true })
  referenceType?: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId?: string;

  @Column({ name: 'quantity_before', type: 'int', default: 0 })
  quantityBefore: number;

  @Column({ name: 'quantity_after', type: 'int', default: 0 })
  quantityAfter: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
