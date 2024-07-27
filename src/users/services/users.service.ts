import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, FilterUsersLogDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/user.entity';
import { RoleService } from './role.service';
import { Between, Repository } from 'typeorm';
import { UserLogs } from '../entities/userLog.entity';
import { CreateUserLogsDto } from '../dto/create-userLog.dto';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(UserLogs)
    private userLogsRepository: Repository<UserLogs>,
    private roleService: RoleService,
    private readonly userContextAuth: UserContextService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userCount = await this.userRepository.count();
    const newUser = this.userRepository.create(createUserDto);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    if (createUserDto.roleIdRole) {
      const role = await this.roleService.findOne(createUserDto.roleIdRole);
      newUser.role = role;
    }

    const savedUser = await this.userRepository.save(newUser);

    if (userCount > 0) {
      const userId = this.userContextAuth.getUser().id_user;
      const logDto: CreateUserLogsDto = {
        id_user_logs: 0,
        title: 'Creación de usuario',
        detail: `Usuario ${savedUser.name} (ID: ${savedUser.id_user}) creado`,
        userIdUser: userId,
        icon: 'user-plus',
        color: '#37D52F',
      };
      await this.createLogUser(logDto);
    }
    return savedUser;
  }

  async findAll() {
    const list = await this.userRepository.find({
      relations: ['role'],
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllWithPayment() {
    const list = await this.userRepository.find({
      relations: ['role'],
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.userRepository.findOne({
      relations: ['role'],
      where: { id_user: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This user #${id} not found`);
    }
    return item;
  }

  async findOneUser(id: number) {
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This user #${id} not found`);
    }
    return item;
  }

  async login(email: string, password: string) {
    const item = await this.userRepository.findOne({
      relations: ['role'],
      where: { email: email, password: password },
    });
    if (!item) {
      throw new NotFoundException(
        `El usuario con el correo ${email} no se ha encontrado`,
      );
    }

    if (item.role) {
      const access = await this.roleService.findOne(item.role.id_role);
      item.role = access;
    }

    const userId = this.userContextAuth.getUser().id_user;
    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Ingreso al sistema',
      detail: `Usuario ${item.name} (ID: ${item.id_user}) ingreso al sistema`,
      userIdUser: userId,
      icon: 'sign-in',
      color: '#37D52F',
    };
    await this.createLogUser(logDto);

    return item;
  }

  async findbyemail(email: string) {
    const item = await this.userRepository.findOne({
      relations: ['role'],
      where: { email: email, status: 1 },
    });

    if (item) {
      if (item.role) {
        const access = await this.roleService.findOne(item.role.id_role);
        item.role = access;
      }
      return item;
    } else {
      throw new NotFoundException(`El usuario ${email} no se ha encontrado`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userId = this.userContextAuth.getUser().id_user;
    const item = await this.userRepository.findOne({
      where: { id_user: id, status: 1 },
      relations: ['role'],
    });

    if (updateUserDto.password) {
      const hashPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashPassword;
    }

    if (updateUserDto.roleIdRole) {
      const role = await this.roleService.findOne(updateUserDto.roleIdRole);
      item.role = role;
    }

    this.userRepository.merge(item, updateUserDto);

    const savedUser = await this.userRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Edición de usuario',
      detail: `Usuario ${savedUser.name} (ID: ${savedUser.id_user}) actualizado`,
      userIdUser: userId,
      icon: 'pencil',
      color: '#2F7FD5',
    };
    this.createLogUser(logDto);

    return savedUser;
  }

  async remove(id: number) {
    const userId = this.userContextAuth.getUser().id_user;
    const item = await this.userRepository.findOneBy({ id_user: id });
    const deleteUser: UpdateUserDto = {
      status: 0,
    };

    this.userRepository.merge(item, deleteUser);

    const savedUser = await this.userRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Eliminación de usuario',
      detail: `Usuario ${savedUser.name} (ID: ${savedUser.id_user}) eliminado`,
      userIdUser: userId,
      icon: 'times',
      color: '#D53C2F',
    };
    this.createLogUser(logDto);

    return savedUser;
  }

  async findAllUserLogsByDates(datestart: Date, dateend: Date) {
    datestart = new Date(datestart);
    datestart.setHours(0, 0, 0, 0);
    dateend = new Date(dateend);
    dateend.setHours(23, 59, 59, 999);

    const list = await this.userRepository.find({
      where: { userLogs: { created_at: Between(datestart, dateend) } },
      relations: { userLogs: true, role: true },
    });

    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllLogs(params?: FilterUsersLogDto) {
    if (params) {
      const { limit, offset, id_user } = params;
      return this.userLogsRepository.find({
        where: { userIdUser: id_user },
        take: limit,
        skip: offset,
        order: {
          id_user_logs: 'DESC',
        },
      });
    }
    return this.userLogsRepository.find();
  }

  async createLogUser(createUserLogsDto: CreateUserLogsDto) {
    const newObj = this.userLogsRepository.create(createUserLogsDto);
    return await this.userLogsRepository.save(newObj);
  }
}
