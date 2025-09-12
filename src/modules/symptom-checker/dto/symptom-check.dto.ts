import { IsString, IsArray, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SeverityLevel {
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  CRITICAL = 4
}

export class SymptomCheckDto {
  @ApiProperty({ description: 'Pet ID' })
  @IsString()
  petId: string;

  @ApiProperty({ description: 'List of symptoms observed' })
  @IsArray()
  @IsString({ each: true })
  symptoms: string[];

  @ApiProperty({ description: 'Duration of symptoms' })
  @IsString()
  duration: string;

  @ApiProperty({ description: 'Severity level', enum: SeverityLevel })
  @IsEnum(SeverityLevel)
  severity: SeverityLevel;

  @ApiProperty({ description: 'Additional information', required: false })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}