import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Role } from './../entities/role.entity';
import { UserLogs } from './userLog.entity';
import { Devices } from 'src/devices/entities/device.entity';
import { Trackers } from 'src/devices/entities/tracker.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 20, default: '-' })
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'int', nullable: false, default: 1 })
  roleIdRole: number;

  @Column({ type: 'varchar', length: 200, default: 'xxx' })
  token: string;

  @Column({ type: 'varchar', length: 30, default: '+591' })
  code_country: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  phone: string;

  @Column({ nullable: true, type: 'varchar', length: 100, default: '' })
  photo: string;

  @Column({ type: 'tinyint', default: 1, comment: '1: enabled, 0: disabled' })
  isEnabled: number;

  @Column({ type: 'text' })
  info: string;

  @Column({ type: 'tinyint', default: 1, comment: '1: active, 0: delete' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updated_at: Date;

  @ManyToOne(() => Role)
  role: Role;

  @OneToMany(() => UserLogs, (userLog) => userLog.user)
  userLogs: UserLogs[];

  @OneToMany(() => Devices, (device) => device.user)
  devices: Devices[];

  @OneToMany(() => Trackers, (tracker) => tracker.user)
  trackers: Trackers[];
}
