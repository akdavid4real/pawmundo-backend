import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectClinicDto {
  @ApiPropertyOptional({ description: 'Reason the clinic verification request was rejected' })
  @IsOptional()
  @IsString()
  reason?: string;
}
