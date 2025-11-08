import { IsString, IsNotEmpty, IsDateString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsDateString()
  scheduledDate: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsEnum(['video', 'audio', 'chat'])
  consultationType?: string;

  @IsOptional()
  @IsNumber()
  cost?: number;
}