import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiPropertyOptional({ 
    description: 'Appointment status',
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show']
  })
  @IsOptional()
  @IsEnum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'])
  status?: string;
}
