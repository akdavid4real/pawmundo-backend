import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInsuranceDto {
  @ApiProperty({ description: 'Pet ID' })
  @IsString()
  petId: string;

  @ApiProperty({ description: 'Insurance provider name' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'Policy number' })
  @IsString()
  policyNumber: string;

  @ApiProperty({ description: 'Plan type' })
  @IsString()
  planType: string;

  @ApiProperty({ description: 'Monthly premium amount' })
  @IsNumber()
  @Min(0)
  monthlyPremium: number;

  @ApiProperty({ description: 'Deductible amount' })
  @IsNumber()
  @Min(0)
  deductible: number;

  @ApiProperty({ description: 'Coverage limit' })
  @IsNumber()
  @Min(0)
  coverageLimit: number;

  @ApiProperty({ description: 'Policy start date' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Policy end date' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}