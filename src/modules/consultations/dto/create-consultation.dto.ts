import { IsString, IsNotEmpty, IsDateString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  @IsNotEmpty()
  petId: string;

  @IsString()
  @IsNotEmpty()
  veterinarianId: string;

  @IsString()
  @IsNotEmpty()
  veterinarianName: string;

  @IsDateString()
  scheduledDate: string;

  @IsNumber()
  duration: number;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsEnum(['video', 'audio', 'chat'])
  consultationType: string;

  @IsOptional()
  @IsNumber()
  cost?: number;
}