import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('history_log')
export class HistoryLogEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id!: string;

  @Column({ length: 50 })
  action!: string;

  @Column({ length: 50 })
  entityType!: string;

  @Index()
  @Column({ length: 100 })
  entityId!: string;

  @Column({ length: 100 })
  source!: string;

  @Column({ length: 100 })
  createdBy!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
