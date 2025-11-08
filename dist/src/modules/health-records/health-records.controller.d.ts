import { HealthRecordsService } from './health-records.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';
export declare class HealthRecordsController {
    private readonly healthRecordsService;
    constructor(healthRecordsService: HealthRecordsService);
    create(req: any, createDto: CreateHealthRecordDto): Promise<import("./schemas/health-record.schema").HealthRecord>;
    findByPet(petId: string, type: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord[]>;
    getUpcomingReminders(req: any): Promise<import("./schemas/health-record.schema").HealthRecord[]>;
    getVaccinations(petId: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord[]>;
    getHealthSummary(petId: string, req: any): Promise<{
        totalRecords: number;
        recordsByType: {};
        lastCheckup: Date;
        nextReminder: Date;
        upcomingCount: number;
        overdueCount: number;
        totalCost: number;
        weightHistory: any[];
    }>;
    findOne(id: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord>;
    update(id: string, updateDto: UpdateHealthRecordDto, req: any): Promise<import("./schemas/health-record.schema").HealthRecord>;
    remove(id: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord>;
    getOverdueReminders(req: any): Promise<import("./schemas/health-record.schema").HealthRecord[]>;
    addAttachment(id: string, url: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord>;
    removeAttachment(id: string, url: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord>;
    getRecordsByDateRange(petId: string, startDate: string, endDate: string, req: any): Promise<import("./schemas/health-record.schema").HealthRecord[]>;
    getHealthAnalytics(req: any): Promise<{
        totalPets: number;
        totalRecords: number;
        recordsThisYear: number;
        upcomingReminders: number;
        totalSpent: number;
        spentThisYear: number;
        recordsByMonth: {
            month: number;
            count: number;
        }[];
        mostCommonType: string;
    }>;
}
