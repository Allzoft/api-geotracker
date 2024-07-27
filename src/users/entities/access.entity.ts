import { PrimaryGeneratedColumn, Column, Entity, ManyToMany } from 'typeorm';

import { Role } from '../entities/role.entity';

@Entity()
export class Access {
  @PrimaryGeneratedColumn()
  id_access: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, comment: 'icons list in Prime Icons' })
  icon: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  link: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  section: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  father: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  position: string;

  @ManyToMany(() => Role, (roles) => roles.access)
  roles: Role[];
}
