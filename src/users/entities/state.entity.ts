import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TypeState {
  RASTREO = 'Rastreo',
}

@Entity()
export class States {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: TypeState,
    default: TypeState.RASTREO,
  })
  type: TypeState;

  @Column({ type: 'int', nullable: false, default: 1 })
  priority: number;

  @Column({ type: 'varchar', length: 50, default: '#ffffff' })
  color: string;

  @Column({ type: 'tinyint', default: 1, comment: '1: Active, 0:Delete' })
  status: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}
