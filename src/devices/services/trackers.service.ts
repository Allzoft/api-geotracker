import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Trackers } from '../entities/tracker.entity';
import { CreateTrackerDto } from '../dto/create-tracker.dto';
import { UserContextService } from 'src/userContext/service/userContext.service';
import { UpdateTrackerDto } from '../dto/update-tracker.dto';
import { spawn } from 'child_process';

@Injectable()
export class TrackersService {
  constructor(
    @InjectRepository(Trackers)
    public trackersRepository: Repository<Trackers>,

    private readonly userContextAuth: UserContextService,
  ) {}

  async create(createTrackerDto: CreateTrackerDto) {
    const userId = this.userContextAuth.getUser().id_user;
    const newClient = this.trackersRepository.create(createTrackerDto);
    newClient.created_by_user = userId;

    return this.trackersRepository.save(newClient);
  }

  async findAll() {
    const list = await this.trackersRepository.find({
      where: { status: 1 },
    });
    if (!list.length) {
      throw new NotFoundException({ message: 'lista vacia' });
    }
    return list;
  }

  async findAllDeleted() {
    const list = await this.trackersRepository.find({
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
    const list = await this.trackersRepository.count({
      where: { status: 1, created_at: Between(datestart, dateend) },
    });

    return list;
  }

  async findOne(id: number) {
    const item = await this.trackersRepository.findOne({
      where: { id_tracker: id, status: 1 },
    });
    if (!item) {
      throw new NotFoundException(`This tracker #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateTrackerDto: UpdateTrackerDto) {
    const tracker = await this.trackersRepository.findOne({
      where: { id_tracker: id },
    });

    if (!tracker) {
      throw new NotFoundException(`Tracker con ID ${id} no encontrado`);
    }

    this.trackersRepository.merge(tracker, updateTrackerDto);

    return this.trackersRepository.save(tracker);
  }

  async remove(id: number) {
    const item = await this.trackersRepository.findOneBy({
      id_tracker: id,
    });
    const deleteTracker: UpdateTrackerDto = {
      status: 0,
    };

    this.trackersRepository.merge(item, deleteTracker);

    return this.trackersRepository.save(item);
  }

  public runScript(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        '/var/www/seeker/seeker.py',
        ...args,
      ]);

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(error));
        } else {
          resolve(output);
        }
      });
    });
  }

  async selectTemplate(templateIndex: number): Promise<string> {
    return this.runScript([templateIndex.toString()]);
  }

  //   async runScript(scriptPath: string, args: string[] = []): Promise<string> {
  //     const command = `python ${scriptPath} ${args.join(' ')}`;
  //     try {
  //       const { stdout, stderr } = await execPromise(command);
  //       if (stderr) {
  //         throw new Error(stderr);
  //       }
  //       return stdout;
  //     } catch (error) {
  //       throw new Error(`Error executing Python script: ${error.message}`);
  //     }
  //   }
}
