import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsEnum,
  NotEquals,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeURLTracker } from '../entities/tracker.entity';

export class CreateTrackerDto {
  @PrimaryGeneratedColumn()
  id_tracker: number;

  @IsNotEmpty()
  @IsInt()
  stateIdState: number;

  @IsNotEmpty()
  @IsInt()
  deviceIdDevice: number;

  @IsEnum(TypeURLTracker)
  @NotEquals(TypeURLTracker[TypeURLTracker.PERSONAS_CERCANAS])
  type_url: TypeURLTracker;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  os?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  platform?: string;

  @IsOptional()
  @IsInt()
  cpuCores?: number;

  @IsOptional()
  @IsInt()
  ram?: number;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  gpuVendor?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  gpu?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  resolution?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  browser?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  publicIp?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  continent?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  org?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  isp?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  accuracy?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  altitude?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  direction?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  speed?: string;

  @IsOptional()
  @IsInt()
  status: number;
}
