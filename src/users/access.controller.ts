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
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { AccessService } from './services/access.service';

@UseGuards(JwtAuthGuard)
@ApiTags('usuarios')
@Controller('accesses')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post()
  create(@Body() createAccessDto: CreateAccessDto) {
    return this.accessService.create(createAccessDto);
  }

  @Get()
  findAll() {
    return this.accessService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessDto: UpdateAccessDto) {
    return this.accessService.update(+id, updateAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessService.remove(+id);
  }
}
