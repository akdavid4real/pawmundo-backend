import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ description: 'Pet ID' })
  @IsString()
  @IsNotEmpty()
  petId: string;

  @ApiProperty({ 
    description: 'Activity type',
    enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other']
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['walk', 'play', 'feeding', 'water', 'exercise', 'other'])
  type: string;

  @ApiProperty({ description: 'Activity date', example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ description: 'Distance in km (for walks)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distance?: number;

  @ApiPropertyOptional({ description: 'Food amount in grams' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  foodAmount?: number;

  @ApiPropertyOptional({ description: 'Water amount in ml' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  waterAmount?: number;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}