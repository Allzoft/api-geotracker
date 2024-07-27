import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentsUsersService } from './services/paymentsUsers.service';

import {
  CreatePaymentsUserDto,
  CreatePaymentsUserGroupDto,
} from './dto/create-paymentsUser.dto';
import {
  UpdatePaymentsUserDto,
  UpdatePaymentsUserGroupDto,
} from './dto/update-paymentsUser.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('paymentsUsers')
export class PaymentsUsersController {
  constructor(private readonly paymentsUsersService: PaymentsUsersService) {}

  @Post()
  create(@Body() createPaymentsUserDto: CreatePaymentsUserDto) {
    return this.paymentsUsersService.create(createPaymentsUserDto);
  }

  @Post('byGroup')
  createGroup(@Body() createPaymentsUserGroupDto: CreatePaymentsUserGroupDto) {
    return this.paymentsUsersService.createGroup(createPaymentsUserGroupDto);
  }

  @Get()
  findAll() {
    return this.paymentsUsersService.findAll();
  }

  @Get('/bydates/:datestart/:dateend')
  findAllBydates(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.paymentsUsersService.findAllByDates(datestart, dateend);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsUsersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentsUserDto: UpdatePaymentsUserDto,
  ) {
    return this.paymentsUsersService.update(+id, updatePaymentsUserDto);
  }

  @Post('byGroup/update')
  updateByGroup(
    @Body() updatePaymentsUserGroupDto: UpdatePaymentsUserGroupDto,
  ) {
    return this.paymentsUsersService.updateGroup(updatePaymentsUserGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsUsersService.remove(+id);
  }
}
