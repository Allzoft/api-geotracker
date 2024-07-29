import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeState } from '../entities/state.entity';

export class CreateStatesDto {
  @PrimaryGeneratedColumn()
  id_state: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeState)
  @NotEquals(TypeState[TypeState.RASTREO])
  type: TypeState;

  @IsString()
  color: string;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsNumber()
  @IsNotEmpty()
  priority: number;
}
