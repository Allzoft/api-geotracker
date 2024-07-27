import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsUser } from '../entities/paymentsUsers.entity';
import { Between, Repository } from 'typeorm';
import {
  CreatePaymentsUserDto,
  CreatePaymentsUserGroupDto,
} from '../dto/create-paymentsUser.dto';
import { States } from 'src/admin/entities/state.entity';
import {
  UpdatePaymentsUserDto,
  UpdatePaymentsUserGroupDto,
} from '../dto/update-paymentsUser.dto';
import { UserContextService } from 'src/userContext/service/userContext.service';

@Injectable()
export class PaymentsUsersService {
  constructor(
    @InjectRepository(PaymentsUser)
    public paymentsUserRepository: Repository<PaymentsUser>,

    @InjectRepository(States)
    public statesRepository: Repository<States>,

    private userContextService: UserContextService,
  ) {}

  async create(createPaymentsUserDto: CreatePaymentsUserDto) {
    const newPaymentUser = await this.paymentsUserRepository.create(
      createPaymentsUserDto,
    );
    const savedPaymentUser =
      await this.paymentsUserRepository.save(newPaymentUser);

    return savedPaymentUser;
  }

  async createGroup(createPaymentsUserGroupDto: CreatePaymentsUserGroupDto) {
    const state = await this.statesRepository.findOne({
      where: { id_state: createPaymentsUserGroupDto.values[0].stateIdState },
    });
    const newPaymentsUser = await Promise.all(
      createPaymentsUserGroupDto.values.map(async (createPaymentUser) => {
        const newPayment =
          await this.paymentsUserRepository.create(createPaymentUser);
        newPayment.state = state;
        return this.paymentsUserRepository.save(newPayment);
      }),
    );
    return newPaymentsUser;
  }

  async findAll() {
    const list = await this.paymentsUserRepository.find({
      where: { status: 1 },
      relations: { state: true, user: { role: true } },
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

    const list = await this.paymentsUserRepository.find({
      where: {
        payment_date: Between(datestart, dateend),
        status: 1,
      },
      relations: { state: true, user: { role: true } },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findOne(id: number) {
    const item = await this.paymentsUserRepository.findOne({
      where: { id_payment_user: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This test #${id} not found`);
    }
    return item;
  }

  async update(id: number, updatePaymentsUserDto: UpdatePaymentsUserDto) {
    const item = await this.paymentsUserRepository.findOne({
      where: { id_payment_user: id },
    });

    if (updatePaymentsUserDto.stateIdState) {
      const state = await this.statesRepository.findOne({
        where: { id_state: updatePaymentsUserDto.stateIdState },
      });
      item.state = state;
    }

    this.paymentsUserRepository.merge(item, updatePaymentsUserDto);

    return await this.paymentsUserRepository.save(item);
  }

  async updateGroup(updatePaymentsUserGroupDto: UpdatePaymentsUserGroupDto) {
    const updatedPaymentsUsers = [];

    for (const updatePaymentUser of updatePaymentsUserGroupDto.values) {
      const { id_payment_user, ...updateData } = updatePaymentUser;

      const paymentUser = await this.paymentsUserRepository.findOne({
        where: { id_payment_user },
      });

      const state = await this.statesRepository.findOne({
        where: { id_state: updateData.stateIdState },
      });
      paymentUser.state = state;

      if (!paymentUser) {
        throw new NotFoundException(
          `Payment user with id ${id_payment_user} not found`,
        );
      }

      this.paymentsUserRepository.merge(paymentUser, updateData);

      try {
        const updatedPaymentUser =
          await this.paymentsUserRepository.save(paymentUser);
        updatedPaymentsUsers.push(updatedPaymentUser);
      } catch (error) {
        throw new InternalServerErrorException('Failed to update payment user');
      }
    }

    return updatedPaymentsUsers;
  }

  async remove(id: number) {
    const item = await this.paymentsUserRepository.findOneBy({
      id_payment_user: id,
    });
    const deleteTest: UpdatePaymentsUserDto = {
      status: 0,
    };

    this.paymentsUserRepository.merge(item, deleteTest);

    return this.paymentsUserRepository.save(item);
  }
}
