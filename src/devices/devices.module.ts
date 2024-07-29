import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserContextModule } from 'src/userContext/userContext.module';
import { UserLogs } from 'src/users/entities/userLog.entity';
import { Devices } from './entities/device.entity';
import { DevicesController } from './devices.controller';
import { DevicesService } from './services/devices.service';
import { Trackers } from './entities/tracker.entity';
import { TrackersController } from './trackers.controller';
import { TrackersService } from './services/trackers.service';
import { TrackersGateway } from './tracker.websocket';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLogs, Devices, Trackers]),
    UserContextModule,
  ],
  controllers: [DevicesController, TrackersController],
  providers: [DevicesService, TrackersService, TrackersGateway],
})
export class DevicesModule {}
