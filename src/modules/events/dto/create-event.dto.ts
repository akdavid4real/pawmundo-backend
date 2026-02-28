import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiPropertyOptional({ description: 'Pet ID associated with the event' })
  @IsOptional()
  @IsUUID()
  petId?: string;

  @ApiProperty({ description: 'Event title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Event date' })
  @IsDateString()
  eventDate: string;

  @ApiPropertyOptional({ description: 'Event time' })
  @IsOptional()
  @IsString()
  eventTime?: string;

  @ApiProperty({ description: 'Event category', enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] })
  @IsEnum(['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'])
  category: string;

  @ApiPropertyOptional({ description: 'Event location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Is recurring event', default: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ description: 'Recurring type', enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  recurringType?: string;
}