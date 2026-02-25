import * as request from 'supertest';
import {
    createTestApp,
    closeTestApp,
    cleanDatabase,
    getHttpServer,
    TEST_USERS,
} from './helpers';

describe('Pets (e2e)', () => {
    let userToken: string;
    let vetToken: string;
    let petId: string;

    beforeAll(async () => {
        await createTestApp();
        await cleanDatabase();

        // Register and get tokens
        const userRes = await request(getHttpServer())
            .post('/api/v1/auth/register')
            .send(TEST_USERS.user);
        userToken = userRes.body.access_token;

        const vetRes = await request(getHttpServer())
            .post('/api/v1/auth/register')
            .send(TEST_USERS.vet);
        vetToken = vetRes.body.access_token;
    });

    afterAll(async () => {
        await cleanDatabase();
        await closeTestApp();
    });

    // ─── Create Pet ────────────────────────────────────────────────

    describe('POST /api/v1/pets', () => {
        it('should allow user to create a pet', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/pets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Buddy',
                    species: 'dog',
                    breed: 'Golden Retriever',
                    age: 3,
                    gender: 'male',
                    weight: 30.5,
                    color: 'Golden',
                })
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.name).toBe('Buddy');
            expect(res.body.species).toBe('dog');
            petId = res.body.id;
        });

        it('should reject pet creation without auth', async () => {
            await request(getHttpServer())
                .post('/api/v1/pets')
                .send({ name: 'Buddy', species: 'dog', breed: 'Lab', age: 2, gender: 'male' })
                .expect(401);
        });

        it('should reject pet with missing required fields', async () => {
            await request(getHttpServer())
                .post('/api/v1/pets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Buddy' })
                .expect(400);
        });
    });

    // ─── Get Pets ──────────────────────────────────────────────────

    describe('GET /api/v1/pets', () => {
        it('should return pets for the authenticated user', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/pets')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].name).toBe('Buddy');
        });

        it('should return empty array for vet with no pets', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/pets')
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);
        });

        it('should filter pets by species', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/pets?species=dog')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            const allDogs = res.body.every((p: any) => p.species === 'dog');
            expect(allDogs).toBe(true);
        });
    });

    // ─── Get Single Pet ────────────────────────────────────────────

    describe('GET /api/v1/pets/:id', () => {
        it('should return pet details for the owner', async () => {
            const res = await request(getHttpServer())
                .get(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body.id).toBe(petId);
            expect(res.body.name).toBe('Buddy');
        });

        it('should deny access to another user\'s pet', async () => {
            await request(getHttpServer())
                .get(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(403);
        });
    });

    // ─── Update Pet ────────────────────────────────────────────────

    describe('PUT /api/v1/pets/:id', () => {
        it('should allow owner to update their pet', async () => {
            const res = await request(getHttpServer())
                .put(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ name: 'Buddy Jr.', weight: 32 })
                .expect(200);

            expect(res.body.name).toBe('Buddy Jr.');
        });

        it('should deny non-owner from updating', async () => {
            await request(getHttpServer())
                .put(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${vetToken}`)
                .send({ name: 'Stolen' })
                .expect(403);
        });
    });

    // ─── Health Status ─────────────────────────────────────────────

    describe('PUT /api/v1/pets/:id/health-status', () => {
        it('should update pet health status', async () => {
            const res = await request(getHttpServer())
                .put(`/api/v1/pets/${petId}/health-status`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ status: 'sick' })
                .expect(200);

            expect(res.body.healthStatus).toBe('sick');
        });
    });

    // ─── Delete Pet ────────────────────────────────────────────────

    describe('DELETE /api/v1/pets/:id', () => {
        it('should deny non-owner from deleting', async () => {
            await request(getHttpServer())
                .delete(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(403);
        });

        it('should allow owner to delete their pet', async () => {
            await request(getHttpServer())
                .delete(`/api/v1/pets/${petId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
        });
    });
});
