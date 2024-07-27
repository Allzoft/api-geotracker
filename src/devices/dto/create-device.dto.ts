import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeDevice } from '../entities/device.entity';

export class CreateDeviceDto {
  @PrimaryGeneratedColumn()
  id_device: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeDevice)
  @NotEquals(TypeDevice[TypeDevice.PERFIL_DE_FACEBOOK])
  type_device: TypeDevice;

  @IsString()
  @IsOptional()
  info: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
