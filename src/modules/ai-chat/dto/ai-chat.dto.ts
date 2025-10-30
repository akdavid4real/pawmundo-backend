import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AiChatDto {
  @ApiProperty({ description: 'User message' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Context for AI', required: false })
  @IsOptional()
  @IsString()
  context?: string;
}