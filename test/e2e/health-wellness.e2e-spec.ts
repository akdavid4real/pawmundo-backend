import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Health & Wellness (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let petId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;

    // Create a test pet
    const petResponse = await request(app.getHttpServer())
      .post('/pets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Pet',
        species: 'dog',
        breed: 'Labrador',
        age: 2,
        gender: 'male',
      });

    petId = petResponse.body._id;
  });

  describe('/activity-tracking (POST)', () => {
    it('should log a walk activity', () => {
      return request(app.getHttpServer())
        .post('/activity-tracking')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          petId: petId,
          type: 'walk',
          date: new Date().toISOString(),
          duration: 30,
          distance: 2.5,
        })
        .expect(201);
    });

    it('should log a feeding activity', () => {
      return request(app.getHttpServer())
        .post('/activity-tracking')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          petId: petId,
          type: 'feeding',
          date: new Date().toISOString(),
          foodAmount: 200,
        })
        .expect(201);
    });
  });

  describe('/medications (POST)', () => {
    it('should add a medication', () => {
      return request(app.getHttpServer())
        .post('/medications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          petId: petId,
          name: 'Flea Prevention',
          dosage: '1 tablet',
          frequency: 'monthly',
          startDate: new Date().toISOString(),
        })
        .expect(201);
    });
  });

  describe('/health-records (POST)', () => {
    it('should create a health record', () => {
      return request(app.getHttpServer())
        .post('/health-records')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          petId: petId,
          type: 'vaccination',
          title: 'Annual Vaccination',
          date: new Date().toISOString(),
          veterinarian: 'Dr. Test',
        })
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});