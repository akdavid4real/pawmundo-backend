import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsuranceClaimDto {
  @ApiProperty({ description: 'Insurance policy ID' })
  @IsString()
  insuranceId: string;

  @ApiProperty({ description: 'Claim amount' })
  @IsNumber()
  @Min(0)
  claimAmount: number;

  @ApiProperty({ description: 'Claim description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Date of service' })
  @IsDateString()
  serviceDate: string;

  @ApiProperty({ description: 'Veterinarian or clinic name', required: false })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({ description: 'Treatment type', required: false })
  @IsOptional()
  @IsString()
  treatmentType?: string;
}