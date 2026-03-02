import * as request from 'supertest';
import {
    createTestApp,
    closeTestApp,
    cleanDatabase,
    getHttpServer,
    TEST_USERS,
} from './helpers';

describe('Consultations (e2e)', () => {
    let userToken: string;
    let vetToken: string;
    let petId: string;
    let consultationId: string;

    beforeAll(async () => {
        await createTestApp();
        await cleanDatabase();

        // Register user + vet
        const userRes = await request(getHttpServer())
            .post('/api/v1/auth/register')
            .send(TEST_USERS.user);
        userToken = userRes.body.access_token;

        const vetRes = await request(getHttpServer())
            .post('/api/v1/auth/register')
            .send(TEST_USERS.vet);
        vetToken = vetRes.body.access_token;

        // Create a pet for consultations
        const petRes = await request(getHttpServer())
            .post('/api/v1/pets')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: 'Buddy', species: 'dog', breed: 'Lab', age: 3, gender: 'male' });
        petId = petRes.body.id;
    });

    afterAll(async () => {
        await cleanDatabase();
        await closeTestApp();
    });

    // ─── Create Consultation ───────────────────────────────────────

    describe('POST /api/v1/consultations', () => {
        it('should allow user to create a consultation', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/consultations')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    petId,
                    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
                    reason: 'Annual checkup',
                    symptoms: 'None',
                    consultationType: 'video',
                })
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.status).toBe('pending');
            consultationId = res.body.id;
        });

        it('should reject consultation without auth', async () => {
            await request(getHttpServer())
                .post('/api/v1/consultations')
                .send({ petId, reason: 'Test', consultationType: 'video' })
                .expect(401);
        });
    });

    // ─── Vet Queue ─────────────────────────────────────────────────

    describe('GET /api/v1/consultations/vet/queue', () => {
        it('should allow vet to access the queue', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/consultations/vet/queue')
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should deny regular user access to vet queue', async () => {
            await request(getHttpServer())
                .get('/api/v1/consultations/vet/queue')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
        });

        it('should deny unauthenticated access', async () => {
            await request(getHttpServer())
                .get('/api/v1/consultations/vet/queue')
                .expect(401);
        });
    });

    // ─── Accept Consultation ───────────────────────────────────────

    describe('POST /api/v1/consultations/:id/accept', () => {
        it('should allow vet to accept a consultation', async () => {
            const res = await request(getHttpServer())
                .post(`/api/v1/consultations/${consultationId}/accept`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(201);

            expect(res.body.status).toBe('assigned');
        });

        it('should deny regular user from accepting', async () => {
            await request(getHttpServer())
                .post(`/api/v1/consultations/${consultationId}/accept`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
        });

        it('should return 201 idempotently if already assigned to the same vet', async () => {
            await request(getHttpServer())
                .post(`/api/v1/consultations/${consultationId}/accept`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(201);
        });
    });

    // ─── Vet Active Consultations ──────────────────────────────────

    describe('GET /api/v1/consultations/vet/active', () => {
        it('should show consultation in vet active list', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/consultations/vet/active')
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // ─── Release Consultation ──────────────────────────────────────

    describe('POST /api/v1/consultations/:id/release', () => {
        it('should allow vet to release consultation', async () => {
            const res = await request(getHttpServer())
                .post(`/api/v1/consultations/${consultationId}/release`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(201);

            expect(res.body.status).toBe('pending');
        });
    });

    // ─── User Consultations ────────────────────────────────────────

    describe('GET /api/v1/consultations', () => {
        it('should return user consultations', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/consultations')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    // ─── Cancel Consultation ───────────────────────────────────────

    describe('PATCH /api/v1/consultations/:id/cancel', () => {
        it('should allow user to cancel their consultation', async () => {
            await request(getHttpServer())
                .patch(`/api/v1/consultations/${consultationId}/cancel`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
        });
    });
});
