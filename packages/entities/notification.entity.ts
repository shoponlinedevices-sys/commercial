import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    unsigned: true,
  })
  id!: string;

  @Index('idx_user_id')
  @Column({
    type: 'bigint',
    unsigned: true,
  })
  userId!: string;

  @Column({
    length: 255,
  })
  title!: string;

  @Column('text')
  message!: string;

  @Column({
    length: 50,
    default: 'system',
  })
  type!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isRead!: boolean;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  readAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}