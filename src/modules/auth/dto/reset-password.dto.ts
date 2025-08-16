import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ description: 'New password (min 8 chars, must contain uppercase, lowercase, number)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number'
  })
  newPassword: string;
}