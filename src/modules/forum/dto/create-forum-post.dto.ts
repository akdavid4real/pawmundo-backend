import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForumPostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    description: 'Post category',
    enum: ['general', 'health', 'training', 'nutrition', 'behavior']
  })
  @IsEnum(['general', 'health', 'training', 'nutrition', 'behavior'])
  category: string;
}