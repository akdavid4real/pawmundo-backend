import { IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateNotificationDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  @IsOptional()
  petId?: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(['appointment', 'medication', 'vaccination', 'checkup', 'weight', 'health_alert', 'reminder', 'info'])
  type: string;

  @IsString()
  @IsOptional()
  actionUrl?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}
