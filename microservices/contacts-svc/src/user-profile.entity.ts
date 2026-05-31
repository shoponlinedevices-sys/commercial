import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_profiles')
export class UserProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;
}
