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
  BadRequestException,
} from '@nestjs/common';
import { TrackersService } from './services/trackers.service';

import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

import { spawn } from 'child_process';

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
  async runScript(@Query('option') option: string) {
    console.log('Received option:', option);

    if (option !== '0' && option !== '1') {
      console.log('Invalid option received');
      throw new BadRequestException('Invalid option. Please choose 0 or 1.');
    }

    const command = 'python3 /var/www/seeker/seeker.py';
    console.log('Executing command:', command);

    const pythonProcess = spawn(command, [], { shell: true });

    return new Promise((resolve, reject) => {
      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        console.log('stdout:', data.toString());
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        console.log('stderr:', data.toString());
        errorOutput += data.toString();
      });

      pythonProcess.on('error', (error) => {
        console.log('Process error:', error);
        reject(new Error('Error starting process: ' + error.message));
      });

      // Write option to stdin and close
      console.log('Writing to stdin:', option);
      pythonProcess.stdin.write(option + '\n');
      pythonProcess.stdin.end();

      pythonProcess.on('close', (code) => {
        console.log('Process exited with code:', code);
        if (code === 0) {
          resolve({ output });
        } else {
          reject(new Error(`Script exited with code ${code}: ${errorOutput}`));
        }
      });
    });
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
