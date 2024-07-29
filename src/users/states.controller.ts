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
import { StatesService } from './services/states.service';
import { CreateStatesDto } from './dto/create-state.dto';
import { UpdateStatesDto } from './dto/update-state.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TypeState } from './entities/state.entity';

@UseGuards(JwtAuthGuard)
@ApiTags('admin')
@Controller('states')
export class StatesController {
  constructor(private readonly statusService: StatesService) {}

  @Post()
  create(@Body() createStatusDto: CreateStatesDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get('/bytype/:type')
  findAllByclient(@Param('type') type: TypeState) {
    return this.statusService.findAllByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatesDto) {
    return this.statusService.update(+id, updateStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.statusService.remove(+id);
    return { message: `State with id: ${id} deleted successfully` };
  }
}
