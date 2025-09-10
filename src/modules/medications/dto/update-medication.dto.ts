import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDto } from './create-medication.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}