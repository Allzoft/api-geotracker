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
import { TrackersService } from './services/trackers.service';

import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@UseGuards(JwtAuthGuard)
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
  @Get('run/tracker/run')
  async runScript() {
    const command = `python3 /var/www/seeker/seeker.py 0`;

    try {
      const { stdout, stderr } = await execPromise(command);
      if (stderr) {
        throw new Error(stderr);
      }
      return { output: stdout };
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
