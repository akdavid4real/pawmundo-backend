import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePetDto } from './create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @ApiPropertyOptional({ 
    description: 'Pet health status',
    enum: ['healthy', 'sick', 'recovering', 'chronic']
  })
  @IsOptional()
  @IsEnum(['healthy', 'sick', 'recovering', 'chronic'])
  healthStatus?: string;
}