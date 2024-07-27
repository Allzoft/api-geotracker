import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { UserContextService } from './service/userContext.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  exports: [UserContextService],
  providers: [UserContextService],
})
export class UserContextModule {}
