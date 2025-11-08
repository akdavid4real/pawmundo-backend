import { Model } from 'mongoose';
import { Activity } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
export declare class ActivityTrackingService {
    private activityModel;
    constructor(activityModel: Model<Activity>);
    create(createActivityDto: CreateActivityDto, userId: string): Promise<Activity>;
    findByPet(petId: string, type?: string): Promise<Activity[]>;
    findById(id: string): Promise<Activity>;
    delete(id: string): Promise<Activity>;
    getDailyStats(petId: string, date: string): Promise<{
        totalWalks: number;
        totalDistance: number;
        totalFeedings: number;
        totalFoodAmount: number;
        totalWaterIntake: number;
        activities: (import("mongoose").Document<unknown, {}, Activity, {}, {}> & Activity & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
}
