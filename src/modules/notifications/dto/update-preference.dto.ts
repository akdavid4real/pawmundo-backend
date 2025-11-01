import { IsBoolean, IsOptional, IsNumber, IsObject, IsMongoId } from 'class-validator';

export class PetNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  appointments?: boolean;

  @IsBoolean()
  @IsOptional()
  medications?: boolean;

  @IsBoolean()
  @IsOptional()
  vaccinations?: boolean;

  @IsBoolean()
  @IsOptional()
  checkups?: boolean;

  @IsBoolean()
  @IsOptional()
  healthAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  weightChanges?: boolean;
}

export class UpdatePreferenceDto {
  @IsBoolean()
  @IsOptional()
  globalEnabled?: boolean;

  @IsMongoId()
  @IsOptional()
  petId?: string;

  @IsObject()
  @IsOptional()
  petSettings?: PetNotificationSettingsDto;

  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsNumber()
  @IsOptional()
  reminderHoursBefore?: number;
}
