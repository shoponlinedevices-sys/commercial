import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('emails')
export class EmailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  to!: string;

  @Column()
  subject!: string;

  @Column('text')
  body!: string;

  @Column({ nullable: true })
  template!: string;

  @Column({ type: 'json', nullable: true })
  templateData!: Record<string, any>;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ nullable: true })
  messageId!: string;

  @Column({ nullable: true })
  error!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  sentAt!: Date;
}
