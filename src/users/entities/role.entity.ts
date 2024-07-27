import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Access } from '../entities/access.entity';
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

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

  @ManyToMany(() => Access, (access) => access.roles)
  @JoinTable()
  access: Access[];
}
