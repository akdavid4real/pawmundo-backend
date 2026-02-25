import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        console.log(`📡 PrismaService: Initializing with host: ${connectionString?.split('@')[1]?.split('/')[0]}`);

        // Prisma v7 requires a driver adapter — use PrismaPg with connectionString
        const adapter = new PrismaPg({ connectionString });

        super({ adapter } as any);
    }

    async onModuleInit() {
        try {
            console.log('🔄 PrismaService: Connecting to database...');
            await this.$connect();
            console.log('🎉 PrismaService: Database connected successfully');
        } catch (error) {
            console.error('❌ PrismaService: Database connection failed', error);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
