import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterClinicDto {
  @ApiProperty({ description: 'Clinic name', example: 'Pawmundo Veterinary Clinic' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Clinic email address' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Clinic phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Clinic physical address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Clinic registration or license number' })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiPropertyOptional({ description: 'Verification document URLs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  verificationDocuments?: string[];

  @ApiProperty({ description: 'Clinic admin email address' })
  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @ApiProperty({ description: 'Clinic admin password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number',
  })
  adminPassword: string;

  @ApiProperty({ description: 'Clinic admin first name' })
  @IsString()
  @IsNotEmpty()
  adminFirstName: string;

  @ApiProperty({ description: 'Clinic admin last name' })
  @IsString()
  @IsNotEmpty()
  adminLastName: string;

  @ApiPropertyOptional({ description: 'Clinic admin phone number' })
  @IsOptional()
  @IsString()
  adminPhone?: string;
}
