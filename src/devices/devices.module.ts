import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserContextModule } from 'src/userContext/userContext.module';
import { UserLogs } from 'src/users/entities/userLog.entity';
import { Devices } from './entities/device.entity';
import { DevicesController } from './devices.controller';
import { DevicesService } from './services/devices.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserLogs, Devices]), UserContextModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
