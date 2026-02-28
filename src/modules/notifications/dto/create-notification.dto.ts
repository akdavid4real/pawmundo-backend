import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
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
