import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AiChatImageDto {
  @ApiProperty({ description: 'Base64 encoded image contents without the data URL prefix' })
  @IsString()
  base64: string;

  @ApiProperty({ description: 'Image MIME type', enum: ['image/jpeg', 'image/png', 'image/webp'] })
  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp'])
  mimeType: string;
}

export class AiChatDto {
  @ApiProperty({ description: 'User message' })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Context for AI. Can be a string or a structured object from mobile clients.',
    oneOf: [{ type: 'string' }, { type: 'object' }],
  })
  @IsOptional()
  context?: string | Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Optional pet image for vision analysis', type: AiChatImageDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AiChatImageDto)
  image?: AiChatImageDto;
}
