import * as request from 'supertest';
import {
    createTestApp,
    closeTestApp,
    cleanDatabase,
    getHttpServer,
    TEST_USERS,
} from './helpers';

describe('Authentication (e2e)', () => {
    let userToken: string;
    let vetToken: string;
    let userId: string;
    let vetId: string;

    beforeAll(async () => {
        await createTestApp();
        await cleanDatabase();
    });

    afterAll(async () => {
        await cleanDatabase();
        await closeTestApp();
    });

    // ─── Registration ──────────────────────────────────────────────

    describe('POST /api/v1/auth/register', () => {
        it('should register a regular user', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/auth/register')
                .send(TEST_USERS.user);

            expect(res.status).toBe(201);

            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.role).toBe('user');
            expect(res.body.user.email).toBe(TEST_USERS.user.email);
            userToken = res.body.access_token;
            userId = res.body.user.id;
        });

        it('should register a vet user', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/auth/register')
                .send(TEST_USERS.vet)
                .expect(201);

            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.role).toBe('vet');
            vetToken = res.body.access_token;
            vetId = res.body.user.id;
        });

        it('should reject duplicate email registration', async () => {
            await request(getHttpServer())
                .post('/api/v1/auth/register')
                .send(TEST_USERS.user)
                .expect(409);
        });

        it('should reject weak passwords', async () => {
            await request(getHttpServer())
                .post('/api/v1/auth/register')
                .send({ ...TEST_USERS.user, email: 'weak@test.com', password: '123' })
                .expect(400);
        });

        it('should reject missing required fields', async () => {
            await request(getHttpServer())
                .post('/api/v1/auth/register')
                .send({ email: 'missing@test.com' })
                .expect(400);
        });
    });

    // ─── Login ─────────────────────────────────────────────────────

    describe('POST /api/v1/auth/login', () => {
        it('should login a regular user', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: TEST_USERS.user.email, password: TEST_USERS.user.password })
                .expect(201);

            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.role).toBe('user');
        });

        it('should login a vet user', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: TEST_USERS.vet.email, password: TEST_USERS.vet.password })
                .expect(201);

            expect(res.body).toHaveProperty('access_token');
            expect(res.body.user.role).toBe('vet');
        });

        it('should reject wrong password', async () => {
            await request(getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: TEST_USERS.user.email, password: 'WrongPass123' })
                .expect(401);
        });

        it('should reject non-existent email', async () => {
            await request(getHttpServer())
                .post('/api/v1/auth/login')
                .send({ email: 'nobody@test.com', password: 'TestPass123' })
                .expect(401);
        });
    });

    // ─── Profile ───────────────────────────────────────────────────

    describe('GET /api/v1/auth/profile', () => {
        it('should return user profile with valid JWT', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/auth/profile')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('email', TEST_USERS.user.email);
        });

        it('should return vet profile with valid JWT', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/auth/profile')
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('email', TEST_USERS.vet.email);
        });

        it('should reject request without JWT', async () => {
            await request(getHttpServer())
                .get('/api/v1/auth/profile')
                .expect(401);
        });

        it('should reject request with invalid JWT', async () => {
            await request(getHttpServer())
                .get('/api/v1/auth/profile')
                .set('Authorization', 'Bearer invalid.token.here')
                .expect(401);
        });
    });
});
