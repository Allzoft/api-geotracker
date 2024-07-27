import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserDto {
  @PrimaryGeneratedColumn()
  id_user: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  roleIdRole: number;

  @IsString()
  @IsOptional()
  token: string;

  @IsString()
  @IsNotEmpty()
  code_country: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsNumber()
  @IsOptional()
  isEnabled: number;

  @IsString()
  @IsOptional()
  info: string;

  @IsNumber()
  @IsOptional()
  status: number;
}

export class FilterUsersLogDto {
  @IsNotEmpty()
  @IsPositive()
  id_user: number;

  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;
}
