import { Model } from 'mongoose';
import { HealthRecord } from './schemas/health-record.schema';
import { PetsService } from '../pets/pets.service';
export declare class HealthRecordsService {
    private healthRecordModel;
    private petsService;
    constructor(healthRecordModel: Model<HealthRecord>, petsService: PetsService);
    create(userId: string, recordData: Partial<HealthRecord>): Promise<HealthRecord>;
    findByPet(petId: string, userId: string, type?: string): Promise<HealthRecord[]>;
    findById(id: string, userId: string): Promise<HealthRecord>;
    update(id: string, userId: string, updateData: Partial<HealthRecord>): Promise<HealthRecord>;
    delete(id: string, userId: string): Promise<HealthRecord>;
    getUpcomingReminders(userId: string): Promise<HealthRecord[]>;
    getVaccinations(petId: string, userId: string): Promise<HealthRecord[]>;
    getHealthSummary(petId: string, userId: string): Promise<{
        totalRecords: number;
        recordsByType: {};
        lastCheckup: Date;
        nextReminder: Date;
        upcomingCount: number;
        overdueCount: number;
        totalCost: number;
        weightHistory: any[];
    }>;
    getOverdueReminders(userId: string): Promise<HealthRecord[]>;
    addAttachment(recordId: string, userId: string, attachmentUrl: string): Promise<HealthRecord>;
    removeAttachment(recordId: string, userId: string, attachmentUrl: string): Promise<HealthRecord>;
    getRecordsByDateRange(petId: string, userId: string, startDate: Date, endDate: Date): Promise<HealthRecord[]>;
    getHealthAnalytics(userId: string): Promise<{
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
