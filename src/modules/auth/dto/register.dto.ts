import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsPhoneNumber, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Password (min 8 chars, must contain uppercase, lowercase, number)',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number'
  })
  password: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;
}