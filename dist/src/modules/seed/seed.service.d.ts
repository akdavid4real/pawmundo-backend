import { Model } from 'mongoose';
import { UserDocument } from '../auth/schemas/user.schema';
import { Connection } from 'mongoose';
export declare class SeedService {
    private userModel;
    private connection;
    constructor(userModel: Model<UserDocument>, connection: Connection);
    seedDatabase(): Promise<{
        message: string;
        summary: {
            users: number;
            pets: number;
            healthRecords: number;
            medications: number;
            notifications: number;
            events: number;
            reminders: number;
        };
    }>;
}
