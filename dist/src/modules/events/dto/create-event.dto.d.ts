export declare class CreateEventDto {
    petId?: string;
    title: string;
    description: string;
    eventDate: string;
    eventTime?: string;
    category: string;
    location?: string;
    notes?: string;
    isRecurring?: boolean;
    recurringType?: string;
}
