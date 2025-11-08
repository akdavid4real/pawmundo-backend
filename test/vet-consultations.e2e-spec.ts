import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('Vet Consultations (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let vetToken: string;
  let userToken: string;
  let petId: string;
  let consultationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    connection = moduleFixture.get<Connection>(getConnectionToken());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await app.close();
  });

  describe('Authentication', () => {
    it('should register a vet user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'vet@test.com',
          password: 'VetPass123',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          role: 'vet',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.role).toBe('vet');
      vetToken = response.body.access_token;
    });

    it('should register a regular user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'user@test.com',
          password: 'UserPass123',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.role).toBe('user');
      userToken = response.body.access_token;
    });

    it('should login vet and return role in token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'vet@test.com',
          password: 'VetPass123',
        })
        .expect(201);

      expect(response.body.user.role).toBe('vet');
      expect(response.body).toHaveProperty('access_token');
    });
  });

  describe('Pet Creation', () => {
    it('should create a pet for user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/pets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Buddy',
          species: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          gender: 'male',
        })
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      petId = response.body._id;
    });
  });

  describe('Consultation Creation', () => {
    it('should create a consultation', async () => {
      const response = await request(app.getHttpServer())
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

      expect(response.body).toHaveProperty('_id');
      expect(response.body.status).toBe('pending');
      consultationId = response.body._id;
    });
  });

  describe('Vet Queue Access', () => {
    it('should allow vet to access queue', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].status).toBe('pending');
    });

    it('should deny regular user access to vet queue', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should deny unauthenticated access to vet queue', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .expect(401);
    });
  });

  describe('Accept Consultation', () => {
    it('should allow vet to accept consultation', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/consultations/${consultationId}/accept`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(201);

      expect(response.body.status).toBe('assigned');
      expect(response.body).toHaveProperty('assignedVet');
    });

    it('should not allow regular user to accept consultation', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${consultationId}/accept`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 409 if consultation already assigned', async () => {
      // Try to accept again
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${consultationId}/accept`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(409);
    });
  });

  describe('Vet Active Consultations', () => {
    it('should show consultation in vet active list', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/active')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]._id).toBe(consultationId);
      expect(response.body[0].status).toBe('assigned');
    });

    it('should not show in queue after acceptance', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      const inQueue = response.body.find((c: any) => c._id === consultationId);
      expect(inQueue).toBeUndefined();
    });
  });

  describe('Release Consultation', () => {
    it('should allow vet to release consultation', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/consultations/${consultationId}/release`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(201);

      expect(response.body.status).toBe('pending');
      expect(response.body.assignedVet).toBeUndefined();
    });

    it('should show consultation back in queue after release', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      const inQueue = response.body.find((c: any) => c._id === consultationId);
      expect(inQueue).toBeDefined();
      expect(inQueue.status).toBe('pending');
    });

    it('should not show in active list after release', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/active')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      const inActive = response.body.find((c: any) => c._id === consultationId);
      expect(inActive).toBeUndefined();
    });
  });

  describe('Complete Consultation Flow', () => {
    it('should accept consultation again', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${consultationId}/accept`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(201);
    });

    it('should start consultation', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/consultations/${consultationId}/start`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          meetingLink: 'https://meet.example.com/123',
        })
        .expect(200);

      expect(response.body.status).toBe('in-progress');
      expect(response.body.meetingLink).toBe('https://meet.example.com/123');
    });

    it('should complete consultation', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/consultations/${consultationId}/complete`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          notes: 'Pet is healthy',
          prescription: 'Vitamin supplements',
        })
        .expect(200);

      expect(response.body.status).toBe('completed');
      expect(response.body.notes).toBe('Pet is healthy');
    });

    it('should show in vet history', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/history')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      const inHistory = response.body.find((c: any) => c._id === consultationId);
      expect(inHistory).toBeDefined();
      expect(inHistory.status).toBe('completed');
    });
  });

  describe('Multiple Vets Scenario', () => {
    let vet2Token: string;
    let newConsultationId: string;

    it('should register second vet', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'vet2@test.com',
          password: 'VetPass123',
          firstName: 'Dr. Mike',
          lastName: 'Chen',
          role: 'vet',
        })
        .expect(201);

      vet2Token = response.body.access_token;
    });

    it('should create another consultation', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/consultations')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          petId,
          scheduledDate: new Date(Date.now() + 86400000).toISOString(),
          reason: 'Follow-up',
          consultationType: 'video',
        })
        .expect(201);

      newConsultationId = response.body._id;
    });

    it('should show in both vets queues', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .get('/api/v1/consultations/vet/queue')
        .set('Authorization', `Bearer ${vet2Token}`)
        .expect(200);

      const inQueue1 = response1.body.find((c: any) => c._id === newConsultationId);
      const inQueue2 = response2.body.find((c: any) => c._id === newConsultationId);

      expect(inQueue1).toBeDefined();
      expect(inQueue2).toBeDefined();
    });

    it('should allow first vet to accept', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${newConsultationId}/accept`)
        .set('Authorization', `Bearer ${vetToken}`)
        .expect(201);
    });

    it('should prevent second vet from accepting', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${newConsultationId}/accept`)
        .set('Authorization', `Bearer ${vet2Token}`)
        .expect(409);
    });

    it('should not allow second vet to release', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/consultations/${newConsultationId}/release`)
        .set('Authorization', `Bearer ${vet2Token}`)
        .expect(403);
    });
  });
});
