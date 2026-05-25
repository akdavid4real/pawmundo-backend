import { IsString, IsNotEmpty, IsDateString, IsNumber, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsultationDto {
  @ApiProperty({
    description: 'Pet ID for the consultation',
    example: '507f1f77bcf86cd799439011'
  })
  @IsString()
  @IsNotEmpty()
  petId: string;

  @ApiProperty({
    description: 'Approved clinic ID for clinic-owned consultation requests',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @ApiProperty({
    description: 'Scheduled date and time for the consultation',
    example: '2024-12-25T10:00:00Z'
  })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({
    description: 'Duration of consultation in minutes',
    example: 30,
    required: false
  })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({
    description: 'Reason for consultation',
    example: 'Annual checkup'
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Symptoms or concerns',
    example: 'Coughing and sneezing for 2 days',
    required: false
  })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiProperty({
    description: 'Type of consultation',
    enum: ['video', 'audio', 'chat'],
    example: 'video',
    required: false
  })
  @IsOptional()
  @IsEnum(['video', 'audio', 'chat'])
  consultationType?: string;

  @ApiProperty({
    description: 'Consultation cost',
    example: 50,
    required: false
  })
  @IsOptional()
  @IsNumber()
  cost?: number;
}
