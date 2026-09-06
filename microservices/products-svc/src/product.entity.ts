import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tbl_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column('float', { nullable: true })
  oldPrice: number;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  image: string;

  @Column({ nullable: true })
  badge: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  unit: string;

  @Column({ nullable: true })
  moq: string;

  @Column({ nullable: true })
  category: string;
}
