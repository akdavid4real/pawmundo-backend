import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty({ description: 'Reply content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}