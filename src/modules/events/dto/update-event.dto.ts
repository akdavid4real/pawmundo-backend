import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({ description: 'Event status', enum: ['scheduled', 'completed', 'cancelled'] })
  @IsOptional()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status?: string;
}