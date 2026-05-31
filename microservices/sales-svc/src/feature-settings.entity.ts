import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('feature_settings')
export class FeatureSettingsEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    unsigned: true,
  })
  id!: string;

  @Index('idx_feature_key')
  @Column({
    name: 'feature_key',
    length: 100,
    unique: true,
  })
  featureKey!: string;

  @Column({
    name: 'feature_name',
    length: 255,
  })
  featureName!: string;

  @Column({
    name: 'is_enabled',
    type: 'boolean',
    default: false,
  })
  isEnabled!: boolean;

  @Column({
    name: 'config',
    type: 'json',
    nullable: true,
  })
  config?: Record<string, any>;

  @Column({
    name: 'start_time',
    type: 'timestamp',
    nullable: true,
  })
  startTime?: Date;

  @Column({
    name: 'end_time',
    type: 'timestamp',
    nullable: true,
  })
  endTime?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
