import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, Min, Max, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePetDto {
  @ApiProperty({ description: 'Pet name', example: 'Buddy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Pet species',
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other']
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'])
  species: string;

  @ApiProperty({ description: 'Pet breed', example: 'Golden Retriever' })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({ description: 'Pet age in years', minimum: 0, maximum: 30 })
  @IsNumber()
  @Min(0)
  @Max(30)
  age: number;

  @ApiProperty({ description: 'Pet gender', enum: ['male', 'female'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['male', 'female'])
  gender: string;

  @ApiPropertyOptional({ description: 'Pet weight in kg' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Pet color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Microchip ID' })
  @IsOptional()
  @IsString()
  microchipId?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional({ description: 'Date of birth', example: '2020-01-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Medical notes' })
  @IsOptional()
  @IsString()
  medicalNotes?: string;

  @ApiPropertyOptional({ description: 'Known allergies', type: [String] })
  @IsOptional()
  @IsArray()
  allergies?: string[];

  @ApiPropertyOptional({ description: 'Past illnesses', type: [String] })
  @IsOptional()
  @IsArray()
  pastIllnesses?: string[];

  @ApiPropertyOptional({ description: 'Previous surgeries', type: [String] })
  @IsOptional()
  @IsArray()
  surgeries?: string[];

  @ApiPropertyOptional({ description: 'Dietary preferences' })
  @IsOptional()
  @IsString()
  dietaryPreferences?: string;

  @ApiPropertyOptional({ description: 'Dietary restrictions', type: [String] })
  @IsOptional()
  @IsArray()
  dietaryRestrictions?: string[];

  @ApiPropertyOptional({ description: 'Behavioral notes and quirky details' })
  @IsOptional()
  @IsString()
  behavioralNotes?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;
}