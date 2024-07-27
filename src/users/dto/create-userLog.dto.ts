import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateUserLogsDto {
  @PrimaryGeneratedColumn()
  id_user_logs: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsNumber()
  @IsNotEmpty()
  userIdUser: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  icon: string;
}
