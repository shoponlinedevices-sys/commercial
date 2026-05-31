import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('delivery_addresses')
export class DeliveryAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  recipientName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column({ default: false })
  isDefault: boolean;
}
