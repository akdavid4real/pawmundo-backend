import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsArray, IsNumber, IsUUID, Min, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHealthRecordDto {
  @ApiProperty({ description: 'Pet ID' })
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @ApiProperty({
    description: 'Record type',
    enum: ['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'grooming', 'other']
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['vaccination', 'checkup', 'surgery', 'medication', 'treatment', 'emergency', 'grooming', 'other'])
  type: string;

  @ApiProperty({ description: 'Record title', example: 'Annual Vaccination' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Detailed description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Record date', example: '2024-01-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Veterinarian name' })
  @IsOptional()
  @IsString()
  veterinarian?: string;

  @ApiPropertyOptional({ description: 'Clinic name' })
  @IsOptional()
  @IsString()
  clinic?: string;

  @ApiPropertyOptional({ description: 'Attachment URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];

  @ApiPropertyOptional({ description: 'Next due date for follow-up' })
  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @ApiPropertyOptional({ description: 'Pet weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Body temperature in Celsius' })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Heart rate (BPM)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  heartRate?: number;

  @ApiPropertyOptional({ description: 'Respiration rate (RPM)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  respiration?: number;

  @ApiPropertyOptional({ description: 'Cost of treatment' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Is this a reminder' })
  @IsOptional()
  @IsBoolean()
  isReminder?: boolean;

  @ApiPropertyOptional({ description: 'Is reminder completed' })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}