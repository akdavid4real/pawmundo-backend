import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateInsuranceDto } from './create-insurance.dto';

export class UpdateInsuranceDto extends PartialType(CreateInsuranceDto) {
  @ApiProperty({ 
    description: 'Policy status',
    enum: ['active', 'expired', 'cancelled', 'pending'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['active', 'expired', 'cancelled', 'pending'])
  status?: string;
}