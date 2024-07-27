import { IsNotEmpty, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateAccessDto {
  @PrimaryGeneratedColumn()
  id_access: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsString()
  @IsNotEmpty()
  father: string;

  @IsString()
  @IsNotEmpty()
  position: string;
}
