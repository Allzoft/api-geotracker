import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Access } from '../entities/access.entity';

import { Role } from '../entities/role.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { CreateUserLogsDto } from '../dto/create-userLog.dto';
import { UserLogs } from '../entities/userLog.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    public roleRepository: Repository<Role>,
    @InjectRepository(Access)
    public accessRepository: Repository<Access>,
    @InjectRepository(UserLogs)
    public userLogsRepository: Repository<UserLogs>,

    private userContextService: UserContextService,
  ) {}

  async create(data: CreateRoleDto) {
    const userId = this.userContextService.getUser().id_user;
    const newObj = this.roleRepository.create(data);

    if (data.id_access) {
      const access = await this.accessRepository.findBy({
        id_access: In(data.id_access),
      });
      newObj.access = access;
    }

    const savedRole = await this.roleRepository.save(newObj);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Creación de rol',
      detail: `Rol ${data.name} (ID: ${savedRole.id_role}) creado`,
      userIdUser: userId,
      icon: 'plus',
      color: '#37D52F',
    };
    this.createLogUser(logDto);

    return savedRole;
  }

  async findAll() {
    const list = await this.roleRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllWithAccess() {
    const list = await this.roleRepository.find({
      where: { status: 1 },
      relations: ['access'],
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const obj = await this.roleRepository.findOne({
      relations: ['access'],
      where: { id_role: id, status: 1 },
    });
    if (!obj) {
      throw new NotFoundException(`This role #${id} not found`);
    }
    return obj;
  }

  async update(id: number, changes: UpdateRoleDto) {
    const userId = this.userContextService.getUser().id_user;
    const item = await this.roleRepository.findOneBy({
      id_role: id,
      status: 1,
    });
    this.roleRepository.merge(item, changes);

    if (changes.id_access) {
      const access = await this.accessRepository.findBy({
        id_access: In(changes.id_access),
      });
      item.access = access;
    }
    const savedRole = await this.roleRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Edición de rol',
      detail: `Rol ${item.name} (ID: ${savedRole.id_role}) actualizado`,
      userIdUser: userId,
      icon: 'pencil',
      color: '#2F7FD5',
    };
    this.createLogUser(logDto);

    return savedRole;
  }

  async remove(id: number) {
    const userId = this.userContextService.getUser().id_user;
    const item = await this.roleRepository.findOneBy({ id_role: id });
    const deleteRole: UpdateRoleDto = {
      status: 0,
    };

    this.roleRepository.merge(item, deleteRole);

    const savedRole = await this.roleRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Eliminación de rol',
      detail: `Rol ${item.name} (ID: ${savedRole.id_role}) eliminado`,
      userIdUser: userId,
      icon: 'times',
      color: '#D53C2F',
    };
    this.createLogUser(logDto);

    return savedRole;
  }

  createLogUser(createUserLogsDto: CreateUserLogsDto) {
    const newObj = this.userLogsRepository.create(createUserLogsDto);
    return this.userLogsRepository.save(newObj);
  }
}
