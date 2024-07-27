import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAccessDto } from '../dto/create-access.dto';
import { UpdateAccessDto } from '../dto/update-access.dto';

import { Access } from '../entities/access.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access) 
    public accessRepository: Repository<Access>
  ){}

  create(createAccessDto: CreateAccessDto) {
    const newItem = this.accessRepository.create(createAccessDto);
    return this.accessRepository.save(newItem);
  }
  
  async findAll() {
    const list = await this.accessRepository.find();
    if(!list.length){
      throw new NotFoundException({message: 'lista vacia'});
    }
    return list;
  }

  async update(id: number, updateAccessDto: UpdateAccessDto) {
    const item = await this.accessRepository.findOneBy({id_access: id });
    this.accessRepository.merge(item , updateAccessDto);

    return this.accessRepository.save(item);
  }

  remove(id: number) {
    return this.accessRepository.delete(id);
  }
}
