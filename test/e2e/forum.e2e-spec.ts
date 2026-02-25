import * as request from 'supertest';
import {
    createTestApp,
    closeTestApp,
    cleanDatabase,
    getHttpServer,
    TEST_USERS,
} from './helpers';

describe('Forum (e2e)', () => {
    let userToken: string;
    let vetToken: string;
    let postId: string;

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
    });

    afterAll(async () => {
        await cleanDatabase();
        await closeTestApp();
    });

    // ─── Create Post ───────────────────────────────────────────────

    describe('POST /api/v1/forum', () => {
        it('should allow user to create a forum post', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/forum')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: 'My dog is awesome',
                    content: 'Just wanted to share how great my dog is!',
                    category: 'general',
                })
                .expect(201);

            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe('My dog is awesome');
            postId = res.body.id;
        });

        it('should allow vet to create a forum post', async () => {
            const res = await request(getHttpServer())
                .post('/api/v1/forum')
                .set('Authorization', `Bearer ${vetToken}`)
                .send({
                    title: 'Vaccination tips for puppies',
                    content: 'Here are some important vaccination tips...',
                    category: 'health',
                })
                .expect(201);

            expect(res.body.title).toBe('Vaccination tips for puppies');
        });

        it('should reject post without auth', async () => {
            await request(getHttpServer())
                .post('/api/v1/forum')
                .send({ title: 'Anon post', content: 'Test', category: 'general' })
                .expect(401);
        });
    });

    // ─── Get Posts ─────────────────────────────────────────────────

    describe('GET /api/v1/forum', () => {
        it('should return all forum posts', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/forum')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThanOrEqual(2);
        });

        it('should filter posts by category', async () => {
            const res = await request(getHttpServer())
                .get('/api/v1/forum?category=health')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body.data.length).toBeGreaterThanOrEqual(1);
        });
    });

    // ─── Get Single Post ──────────────────────────────────────────

    describe('GET /api/v1/forum/:id', () => {
        it('should return post details', async () => {
            const res = await request(getHttpServer())
                .get(`/api/v1/forum/${postId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);

            expect(res.body.id).toBe(postId);
            expect(res.body.title).toBe('My dog is awesome');
        });
    });

    // ─── Like Post ─────────────────────────────────────────────────

    describe('POST /api/v1/forum/:id/like', () => {
        it('should allow user to like a post', async () => {
            const res = await request(getHttpServer())
                .post(`/api/v1/forum/${postId}/like`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(201);

            expect(res.body).toHaveProperty('likesCount');
        });

        it('should toggle like off when liked again', async () => {
            await request(getHttpServer())
                .post(`/api/v1/forum/${postId}/like`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(201);
        });
    });

    // ─── Reply to Post ────────────────────────────────────────────

    describe('POST /api/v1/forum/:id/replies', () => {
        it('should allow vet to reply to a post', async () => {
            const res = await request(getHttpServer())
                .post(`/api/v1/forum/${postId}/replies`)
                .set('Authorization', `Bearer ${vetToken}`)
                .send({ content: 'Great post! I agree.' })
                .expect(201);

            expect(res.body).toHaveProperty('id');
        });

        it('should allow user to reply to their own post', async () => {
            const res = await request(getHttpServer())
                .post(`/api/v1/forum/${postId}/replies`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ content: 'Thanks for the kind words!' })
                .expect(201);

            expect(res.body).toHaveProperty('id');
        });
    });

    // ─── Delete Post ───────────────────────────────────────────────

    describe('DELETE /api/v1/forum/:id', () => {
        it('should deny non-author from deleting', async () => {
            await request(getHttpServer())
                .delete(`/api/v1/forum/${postId}`)
                .set('Authorization', `Bearer ${vetToken}`)
                .expect(403);
        });

        it('should allow author to delete their post', async () => {
            await request(getHttpServer())
                .delete(`/api/v1/forum/${postId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .expect(200);
        });
    });
});
