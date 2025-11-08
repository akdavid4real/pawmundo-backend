export declare class CreateHealthRecordDto {
    petId: string;
    type: string;
    title: string;
    description?: string;
    date: string;
    veterinarian?: string;
    clinic?: string;
    attachments?: string[];
    nextDueDate?: string;
    weight?: number;
    temperature?: number;
    heartRate?: number;
    cost?: number;
    notes?: string;
    isReminder?: boolean;
    isCompleted?: boolean;
}
