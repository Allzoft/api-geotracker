import { PartialType } from '@nestjs/swagger';
import { CreateStatesDto } from './create-state.dto';

export class UpdateStatesDto extends PartialType(CreateStatesDto) {}
