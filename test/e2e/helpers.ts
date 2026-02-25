import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

/**
 * E2E Test Helpers
 * Provides app bootstrapping, user auth helpers, and database cleanup.
 */

let app: INestApplication;
let prisma: PrismaService;

/**
 * Bootstrap the NestJS application for e2e testing.
 */
export async function createTestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    await app.init();

    prisma = app.get(PrismaService);

    return app;
}

/**
 * Get the PrismaService instance from the test app.
 */
export function getPrisma(): PrismaService {
    return prisma;
}

/**
 * Clean up all test data from the database.
 * Uses TRUNCATE CASCADE on all tables for reliable cleanup.
 */
export async function cleanDatabase(): Promise<void> {
    const p = getPrisma();

    const tables = [
        'forum_likes',
        'forum_replies',
        'forum_posts',
        'consultation_messages',
        'consultation_notes',
        'notifications',
        'notification_preferences',
        'activities',
        'symptom_checks',
        'prescriptions',
        'health_records',
        'insurance_claims',
        'insurances',
        'medications',
        'consultations',
        'appointments',
        'events',
        'pets',
        'users',
    ];

    for (const table of tables) {
        await p.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
    }
}

/**
 * Close the test application.
 */
export async function closeTestApp(): Promise<void> {
    if (app) {
        await app.close();
    }
}

/**
 * Get the HTTP server from the app (for supertest).
 */
export function getHttpServer() {
    return app.getHttpServer();
}

/**
 * Test users for multi-role testing.
 */
export const TEST_USERS = {
    user: {
        email: 'testuser@pawpromise-e2e.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
    },
    vet: {
        email: 'testvet@pawpromise-e2e.com',
        password: 'VetPass123',
        firstName: 'Dr. Test',
        lastName: 'Vet',
        role: 'vet',
    },
};
