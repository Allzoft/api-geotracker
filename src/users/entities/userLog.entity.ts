import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';

@Entity()
export class UserLogs {
  @PrimaryGeneratedColumn()
  id_user_logs: number;

  @Column({ type: 'int', nullable: false })
  userIdUser: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text' })
  detail: string;

  @Column({ type: 'varchar', length: 10 })
  color: string;

  @Column({ type: 'varchar', length: 10 })
  icon: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @ManyToOne(() => Users, (user) => user.userLogs)
  user: Users;
}
