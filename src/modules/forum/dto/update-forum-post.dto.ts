import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateForumPostDto {
  @ApiProperty({ description: 'Post title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Post content', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ 
    description: 'Post category',
    enum: ['general', 'health', 'training', 'nutrition', 'behavior'],
    required: false
  })
  @IsEnum(['general', 'health', 'training', 'nutrition', 'behavior'])
  @IsOptional()
  category?: string;
}