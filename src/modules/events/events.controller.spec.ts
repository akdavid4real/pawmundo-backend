import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('EventsController (e2e)', () => {
  let app: INestApplication;
  let eventsService = {
    create: jest.fn().mockImplementation((userId, dto) => {
      return Promise.resolve({ id: 'event-uuid-123', userId, ...dto });
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: eventsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'test-user-uuid' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    // It's crucial to enable the global validation pipe to test DTO validation
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/events (POST) - should create event with valid UUID petId', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        petId: 'f8546b2b-5f0a-40a2-a9b0-958b4ba3c3d5', // valid UUID
        title: 'Vet Appointment',
        description: 'Annual checkup',
        eventDate: new Date().toISOString(),
        category: 'appointment',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.petId).toEqual('f8546b2b-5f0a-40a2-a9b0-958b4ba3c3d5');
      });
  });

  it('/events (POST) - should reject event with MongoDB ObjectId petId', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        petId: '507f1f77bcf86cd799439011', // valid MongoDB ObjectId, invalid UUID
        title: 'Vet Appointment',
        description: 'Annual checkup',
        eventDate: new Date().toISOString(),
        category: 'appointment',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining(['petId must be a UUID'])
        );
      });
  });

  it('/events (POST) - should create event without petId (optional field)', () => {
    return request(app.getHttpServer())
      .post('/events')
      .send({
        title: 'General Reminder',
        description: 'Buy dog food',
        eventDate: new Date().toISOString(),
        category: 'other',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.petId).toBeUndefined();
      });
  });
});
