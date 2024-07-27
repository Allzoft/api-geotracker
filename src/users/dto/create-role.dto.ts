import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateRoleDto {
  @PrimaryGeneratedColumn()
  id_role: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsArray()
  @IsNotEmpty()
  readonly id_access: number[];
}
