import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import config from './../config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/user.entity';
import { UserContextModule } from 'src/userContext/userContext.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    UsersModule,
    PassportModule,
    UserContextModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
