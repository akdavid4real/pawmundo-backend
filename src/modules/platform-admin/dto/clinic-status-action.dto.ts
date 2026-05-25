import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ClinicStatusActionDto {
  @ApiPropertyOptional({ description: 'Reason for the platform status change' })
  @IsOptional()
  @IsString()
  reason?: string;
}
