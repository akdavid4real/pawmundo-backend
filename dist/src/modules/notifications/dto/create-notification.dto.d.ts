export declare class CreateNotificationDto {
    userId: string;
    petId?: string;
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
    metadata?: Record<string, any>;
}
