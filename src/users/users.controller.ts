import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './services/users.service';
import { CreateUserDto, FilterUsersLogDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/availablePayment')
  findAllWithPayments() {
    return this.usersService.findAllWithPayment();
  }

  @Get('/logs')
  findAllLogs(@Query() params: FilterUsersLogDto) {
    return this.usersService.findAllLogs(params);
  }

  @Get('/logs/bydates/:datestart/:dateend')
  findAllLogsBydates(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.usersService.findAllUserLogsByDates(datestart, dateend);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('login/:email/:password')
  login(@Param('email') email: string, @Param('password') password: string) {
    return this.usersService.login(email, password);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(+id);
    return { message: `User with id: ${id} deleted successfully` };
  }
}
