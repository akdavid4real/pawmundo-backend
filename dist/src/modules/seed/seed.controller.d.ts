import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
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
