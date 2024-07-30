import { States } from 'src/users/entities/state.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Devices } from './device.entity';
import { Users } from 'src/users/entities/user.entity';

export enum TypeURLTracker {
  PERSONAS_CERCANAS = 'Personas cercanas',
  GOOGLE_DRIVE = 'Google drive',
  GRUPO_DE_WHATSAPP_FALSO = 'Grupo de whatsapp falso',
  GRUPO_DE_WHATSAPP_REAL = 'Grupo de whatsapp real',
  GRUPO_DE_TELEGRAM = 'Grupo de telegram',
  ZOOM = 'zoom',
  GOOGLE_RECAPTCHA = 'Google recaptcha',
}

@Entity()
export class Trackers {
  @PrimaryGeneratedColumn()
  id_tracker: number;

  @Column({ type: 'int', nullable: false })
  stateIdState: number;

  @Column({ type: 'int', nullable: false })
  deviceIdDevice: number;

  @Column({
    type: 'enum',
    enum: TypeURLTracker,
    default: TypeURLTracker.PERSONAS_CERCANAS,
  })
  type_url: TypeURLTracker;

  @Column({ type: 'varchar', length: 255, nullable: true })
  os: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  platform: string;

  @Column({ type: 'int', nullable: true })
  cpuCores: number;

  @Column({ type: 'int', nullable: true })
  ram: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gpuVendor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  gpu: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resolution: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  browser: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  publicIp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  continent: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  country: string;

  @Column({ type: 'int', nullable: false })
  created_by_user: number;

  @Column({ type: 'timestamp', nullable: true })
  tracker_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  org: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  isp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  latitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  longitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  accuracy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  altitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direction: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  speed: string;

  @ManyToOne(() => States, (state) => state.trackers)
  state: States;

  @ManyToOne(() => Devices, (device) => device.trackers)
  device: Devices;

  @Column({ type: 'tinyint', default: 1, comment: '1: active, 0: delete' })
  status: number;

  @ManyToOne(() => Users, (user) => user.devices)
  @JoinColumn({ name: 'created_by_user' })
  user: Users;

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
}
