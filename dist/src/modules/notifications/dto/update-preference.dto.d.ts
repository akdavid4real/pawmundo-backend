export declare class PetNotificationSettingsDto {
    appointments?: boolean;
    medications?: boolean;
    vaccinations?: boolean;
    checkups?: boolean;
    healthAlerts?: boolean;
    weightChanges?: boolean;
}
export declare class UpdatePreferenceDto {
    globalEnabled?: boolean;
    petId?: string;
    petSettings?: PetNotificationSettingsDto;
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    reminderHoursBefore?: number;
}
