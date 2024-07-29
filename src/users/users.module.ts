import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from './entities/user.entity';
import { UserLogs } from './entities/userLog.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

import { Role } from './entities/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './services/role.service';

import { Access } from './entities/access.entity';
import { AccessController } from './access.controller';
import { AccessService } from './services/access.service';
import { UserContextModule } from 'src/userContext/userContext.module';
import { States } from './entities/state.entity';
import { StatesController } from './states.controller';
import { StatesService } from './services/states.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserLogs, Role, Access, States]),
    UserContextModule,
  ],
  controllers: [
    UsersController,
    RoleController,
    AccessController,
    StatesController,
  ],
  providers: [UsersService, RoleService, AccessService, StatesService],
  exports: [UsersService],
})
export class UsersModule {}
