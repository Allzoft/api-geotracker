import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Trackers } from '../entities/tracker.entity';
import { CreateTrackerDto } from '../dto/create-tracker.dto';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { UpdateTrackerDto } from '../dto/update-tracker.dto';
import { States, TypeState } from 'src/users/entities/state.entity';
import { Devices } from '../entities/device.entity';

@Injectable()
export class TrackersService {
  constructor(
    @InjectRepository(Trackers)
    public trackersRepository: Repository<Trackers>,

    @InjectRepository(States)
    public statesRepository: Repository<States>,

    @InjectRepository(Devices)
    public devicesRepository: Repository<Devices>,

    private readonly userContextAuth: UserContextService,
  ) {}

  async create(createTrackerDto: CreateTrackerDto) {
    const userId = this.userContextAuth.getUser().id_user;
    const newTracker = this.trackersRepository.create(createTrackerDto);
    newTracker.created_by_user = userId;

    const state = await this.statesRepository.findOne({
      where: { priority: 1, type: TypeState.RASTREO },
    });

    newTracker.stateIdState = state.id_state;
    newTracker.state = state;

    const device = await this.devicesRepository.findOne({
      where: { id_device: createTrackerDto.deviceIdDevice },
    });

    newTracker.device = device;

    return await this.trackersRepository.save(newTracker);
  }

  async findAll() {
    const list = await this.trackersRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllDeleted() {
    const list = await this.trackersRepository.find({
      where: { status: 0 },
      order: { updated_at: 'DESC' },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllByDates(datestart: Date, dateend: Date) {
    datestart = new Date(datestart);
    datestart.setHours(0, 0, 0, 0);
    dateend = new Date(dateend);
    dateend.setHours(23, 59, 59, 999);
    const list = await this.trackersRepository.find({
      where: { status: 1, created_at: Between(datestart, dateend) },
      relations: { device: true, state: true },
    });

    return list;
  }

  async findOne(id: number) {
    const item = await this.trackersRepository.findOne({
      where: { id_tracker: id, status: 1 },
      relations: { device: true, state: true },
    });
    if (!item) {
      throw new NotFoundException(`This tracker #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateTrackerDto: UpdateTrackerDto) {
    const tracker = await this.trackersRepository.findOne({
      where: { id_tracker: id },
    });

    if (!tracker) {
      throw new NotFoundException(`Tracker con ID ${id} no encontrado`);
    }

    this.trackersRepository.merge(tracker, updateTrackerDto);

    return this.trackersRepository.save(tracker);
  }

  async remove(id: number) {
    const item = await this.trackersRepository.findOneBy({
      id_tracker: id,
    });
    const deleteTracker: UpdateTrackerDto = {
      status: 0,
    };

    this.trackersRepository.merge(item, deleteTracker);

    return this.trackersRepository.save(item);
  }
}
