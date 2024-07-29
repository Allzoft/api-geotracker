import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trackers } from './tracker.entity';

export enum TypeDevice {
  PERFIL_DE_FACEBOOK = 'Perfil de facebook',
  CUENTA_DE_WHATSAPP = 'Cuenta de whatsapp',
  CUENTA_DE_TELEGRAM = 'Cuenta de telegram',
  OTRO = 'Otro',
}

@Entity()
export class Devices {
  @PrimaryGeneratedColumn()
  id_device: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  created_by_user: number;

  @Column({
    type: 'enum',
    enum: TypeDevice,
    default: TypeDevice.PERFIL_DE_FACEBOOK,
  })
  type_device: TypeDevice;

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

  @ManyToOne(() => Users, (user) => user.devices)
  @JoinColumn({ name: 'created_by_user' })
  user: Users;

  @OneToMany(() => Trackers, (tracker) => tracker.device)
  trackers: Trackers[];
}
