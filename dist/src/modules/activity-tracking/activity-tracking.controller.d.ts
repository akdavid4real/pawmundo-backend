import { ActivityTrackingService } from './activity-tracking.service';
import { CreateActivityDto } from './dto/create-activity.dto';
export declare class ActivityTrackingController {
    private readonly activityTrackingService;
    constructor(activityTrackingService: ActivityTrackingService);
    create(req: any, createActivityDto: CreateActivityDto): Promise<import("./schemas/activity.schema").Activity>;
    findByPet(petId: string, type?: string): Promise<import("./schemas/activity.schema").Activity[]>;
    getDailyStats(petId: string, date: string): Promise<{
        totalWalks: number;
        totalDistance: number;
        totalFeedings: number;
        totalFoodAmount: number;
        totalWaterIntake: number;
        activities: (import("mongoose").Document<unknown, {}, import("./schemas/activity.schema").Activity, {}, {}> & import("./schemas/activity.schema").Activity & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    remove(id: string): Promise<import("./schemas/activity.schema").Activity>;
}
