import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TrackersService } from './services/trackers.service';

import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('trackers')
@Controller('trackers')
export class TrackersController {
  constructor(private readonly trackersService: TrackersService) {}

  @Post()
  create(@Body() createTrackerDto: CreateTrackerDto) {
    return this.trackersService.create(createTrackerDto);
  }

  @Get()
  findAll() {
    return this.trackersService.findAll();
  }

  @Get('deleted')
  findAllDeleted() {
    return this.trackersService.findAllDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trackersService.findOne(+id);
  }

  @Get('/bydates/:datestart/:dateend')
  findAllBydates(
    @Param('datestart') datestart: Date,
    @Param('dateend') dateend: Date,
  ) {
    return this.trackersService.findAllByDates(datestart, dateend);
  }

  @Public()
  @Get('run')
  async runScript(@Query('args') args: string) {
    const argsArray = args ? args.split(',') : [];
    try {
      const output = await this.trackersService.runScript(argsArray);
      return { output };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrackerDto: UpdateTrackerDto) {
    return this.trackersService.update(+id, updateTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trackersService.remove(+id);
  }
}
