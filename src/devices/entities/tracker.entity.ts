import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Trackers {
  @PrimaryGeneratedColumn()
  id_tracker: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  gps: string;
}
