import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    declare pool: Pool; // Use declare to avoid transpilation of a property definition before super()

    constructor() {
        const connectionString = process.env.DATABASE_URL || '';
        const pool = new Pool({
            connectionString: connectionString.includes('.pooler.supabase.com:5432')
                ? connectionString.replace(':5432', ':6543')
                : connectionString
        });

        super({ adapter: new PrismaPg(pool) });
        this.pool = pool;

        console.log(`📡 PrismaService: Initializing with host: ${connectionString.split('@')[1]?.split('/')[0]}`);
    }

    async onModuleInit() {
        try {
            console.log('🔄 PrismaService: Connecting to database...');
            await this.$connect();
            console.log('🎉 PrismaService: Database connected successfully');
        } catch (error) {
            console.error('❌ PrismaService: Database connection failed', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        if (this.pool) {
            await this.pool.end();
        }
    }
}
