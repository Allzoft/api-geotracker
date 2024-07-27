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

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserLogs, Role, Access]),
    UserContextModule,
  ],
  controllers: [UsersController, RoleController, AccessController],
  providers: [UsersService, RoleService, AccessService],
  exports: [UsersService],
})
export class UsersModule {}
