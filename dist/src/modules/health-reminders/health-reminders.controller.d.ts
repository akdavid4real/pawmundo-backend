import { HealthRemindersService } from './health-reminders.service';
export declare class HealthRemindersController {
    private readonly healthRemindersService;
    constructor(healthRemindersService: HealthRemindersService);
    getReminders(req: any): Promise<{
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
    createVaccinationReminders(petId: string, req: any): Promise<any>;
}
