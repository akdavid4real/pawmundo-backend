import { IsString, IsNotEmpty, IsDateString, IsOptional, IsEnum, IsMongoId, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Pet ID' })
  @IsMongoId()
  @IsNotEmpty()
  petId: string;

  @ApiProperty({ description: 'Veterinarian name' })
  @IsString()
  @IsNotEmpty()
  vetName: string;

  @ApiProperty({ description: 'Veterinary clinic name' })
  @IsString()
  @IsNotEmpty()
  vetClinic: string;

  @ApiProperty({ description: 'Appointment date', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ description: 'Appointment time', example: '10:30 AM' })
  @IsString()
  @IsNotEmpty()
  appointmentTime: string;

  @ApiProperty({ description: 'Reason for appointment' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Veterinarian phone number' })
  @IsOptional()
  @IsString()
  vetPhone?: string;

  @ApiPropertyOptional({ description: 'Veterinarian email' })
  @IsOptional()
  @IsEmail()
  vetEmail?: string;
}