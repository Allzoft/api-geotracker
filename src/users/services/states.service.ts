import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatesDto } from '../dto/create-state.dto';
import { UpdateStatesDto } from '../dto/update-state.dto';
import { States, TypeState } from '../entities/state.entity';
import { UserLogs } from 'src/users/entities/userLog.entity';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { CreateUserLogsDto } from 'src/users/dto/create-userLog.dto';

@Injectable()
export class StatesService {
  constructor(
    @InjectRepository(States)
    public statusRepository: Repository<States>,
    @InjectRepository(UserLogs)
    public userLogsRepository: Repository<UserLogs>,

    private userContextService: UserContextService,
  ) {}

  async create(createStatesDto: CreateStatesDto) {
    const userId = this.userContextService.getUser().id_user;
    const newState = this.statusRepository.create(createStatesDto);
    const savedState = await this.statusRepository.save(newState);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Creación de estado',
      detail: `Rol ${createStatesDto.name} (ID: ${savedState.id_state}) creado`,
      userIdUser: userId,
      icon: 'plus',
      color: '#37D52F',
    };
    this.createLogUser(logDto);

    return savedState;
  }

  async findAll() {
    const list = await this.statusRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllByType(type: TypeState) {
    const list = await this.statusRepository.find({
      where: { type: type, status: 1 },
      order: {
        priority: 'ASC',
      },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'empty states by type list ' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.statusRepository.findOne({
      where: { id_state: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This state #${id} not found`);
    }
    return item;
  }

  async update(id: number, changes: UpdateStatesDto) {
    const userId = this.userContextService.getUser().id_user;
    const item = await this.statusRepository.findOneBy({
      id_state: id,
      status: 1,
    });
    this.statusRepository.merge(item, changes);

    const savedState = await this.statusRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Edicion de estado',
      detail: `Rol ${item.name} (ID: ${savedState.id_state}) actualizado`,
      userIdUser: userId,
      icon: 'pencil',
      color: '#2F7FD5',
    };
    this.createLogUser(logDto);

    return savedState;
  }

  async remove(id: number) {
    const userId = this.userContextService.getUser().id_user;
    const item = await this.statusRepository.findOneBy({ id_state: id });
    const deleteStates: UpdateStatesDto = {
      status: 0,
    };

    this.statusRepository.merge(item, deleteStates);

    const savedState = await this.statusRepository.save(item);

    const logDto: CreateUserLogsDto = {
      id_user_logs: 0,
      title: 'Eliminación de estado',
      detail: `Rol ${item.name} (ID: ${savedState.id_state}) eliminado`,
      userIdUser: userId,
      icon: 'times',
      color: '#D53C2F',
    };
    this.createLogUser(logDto);

    return savedState;
  }

  createLogUser(createUserLogsDto: CreateUserLogsDto) {
    const newObj = this.userLogsRepository.create(createUserLogsDto);
    return this.userLogsRepository.save(newObj);
  }
}
