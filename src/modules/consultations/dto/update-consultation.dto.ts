import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto';
import { IsOptional, IsEnum, IsString, IsBoolean, IsDateString } from 'class-validator';

export class UpdateConsultationDto extends PartialType(CreateConsultationDto) {
  @IsOptional()
  @IsEnum(['scheduled', 'in-progress', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsBoolean()
  followUpRequired?: boolean;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsString()
  meetingLink?: string;

  @IsOptional()
  @IsString()
  meetingId?: string;

  @IsOptional()
  @IsEnum(['pending', 'paid', 'refunded'])
  paymentStatus?: string;
}