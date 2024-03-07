import { PartialType } from '@nestjs/swagger';
import { CreateHabDto } from './create-hab.dto';

export class UpdateHabDto extends PartialType(CreateHabDto) {}
