import { HealthRecordsService } from '../health-records/health-records.service';
import { PetsService } from '../pets/pets.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class HealthRemindersService {
    private healthRecordsService;
    private petsService;
    private notificationsService;
    constructor(healthRecordsService: HealthRecordsService, petsService: PetsService, notificationsService: NotificationsService);
    sendDailyReminders(): Promise<void>;
    getRemindersForUser(userId: string): Promise<{
        upcoming: {
            id: unknown;
            petId: any;
            petName: any;
            type: string;
            title: string;
            dueDate: Date;
            daysUntilDue: number;
        }[];
        overdue: {
            id: unknown;
            petId: any;
            petName: any;
            type: string;
            title: string;
            dueDate: Date;
            daysOverdue: number;
        }[];
    }>;
    createVaccinationReminders(petId: string, userId: string): Promise<any>;
    private getVaccinationSchedule;
}
