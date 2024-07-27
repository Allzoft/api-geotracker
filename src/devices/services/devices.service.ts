import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Devices } from '../entities/device.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { UpdateDeviceDto } from '../dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Devices)
    public devicesRepository: Repository<Devices>,

    private readonly userContextAuth: UserContextService,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const userId = this.userContextAuth.getUser().id_user;
    const newClient = this.devicesRepository.create(createDeviceDto);
    newClient.created_by_user = userId;

    return this.devicesRepository.save(newClient);
  }

  async findAll() {
    const list = await this.devicesRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllDeleted() {
    const list = await this.devicesRepository.find({
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
    const list = await this.devicesRepository.count({
      where: { status: 1, created_at: Between(datestart, dateend) },
    });

    return list;
  }

  async findOne(id: number) {
    const item = await this.devicesRepository.findOne({
      where: { id_device: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This device #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    const device = await this.devicesRepository.findOne({
      where: { id_device: id },
    });

    if (!device) {
      throw new NotFoundException(`Device con ID ${id} no encontrado`);
    }

    this.devicesRepository.merge(device, updateDeviceDto);

    return this.devicesRepository.save(device);
  }

  async remove(id: number) {
    const item = await this.devicesRepository.findOneBy({
      id_device: id,
    });
    const deleteDevice: UpdateDeviceDto = {
      status: 0,
    };

    this.devicesRepository.merge(item, deleteDevice);

    return this.devicesRepository.save(item);
  }
}
