import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        let connectionString = process.env.DATABASE_URL || '';
        console.log(`📡 PrismaService: Initializing with host: ${connectionString.split('@')[1]?.split('/')[0]}`);

        // Supabase specific connection pooling fix for Vercel Serverless
        // Convert Session mode port (5432) to Transaction mode port (6543)
        if (connectionString.includes('.pooler.supabase.com:5432')) {
            connectionString = connectionString.replace(':5432', ':6543');
        }

        // Initialize pg Pool with max connections = 1 to prevent exhausting the pool in serverless environments
        const pool = new Pool({
            connectionString,
            max: 1 // Crucial for Vercel Serverless functions!
        });

        // Prisma v7 requires a driver adapter
        const adapter = new PrismaPg(pool);

        super({ adapter });
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
