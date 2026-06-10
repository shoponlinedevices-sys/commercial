import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tbl_account')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'password_hash' })
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
