import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('ActivityTrackingController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;
  const mockUserId = 'mock-user-id';
  const mockPetId = 'mock-pet-id';
  const mockActivityId = 'mock-activity-id';

  beforeAll(async () => {
    // We mock PrismaService to run E2E tests without a real DB
    const mockPrisma = {
      activity: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        aggregate: jest.fn(),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue({ id: mockUserId, role: 'user' }),
      }
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    prismaService = app.get<PrismaService>(PrismaService);

    // Generate a valid JWT for testing
    const jwtService = app.get<JwtService>(JwtService);
    jwtToken = jwtService.sign({ sub: mockUserId, email: 'test@test.com', role: 'user' });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/activity-tracking', () => {
    it('should create an activity', async () => {
      const createDto = {
        petId: mockPetId,
        type: 'walk',
        date: new Date().toISOString(),
        duration: 30,
        distance: 2.5,
      };

      const mockCreatedActivity = {
        id: mockActivityId,
        ...createDto,
        userId: mockUserId,
        isActive: true,
      };

      (prismaService.activity.create as jest.Mock).mockResolvedValue(mockCreatedActivity);

      const response = await request(app.getHttpServer())
        .post('/api/v1/activity-tracking')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createDto)
        .expect(201);

      expect(response.body).toEqual(mockCreatedActivity);
    });

    it('should fail with invalid data', async () => {
      const createDto = {
        petId: mockPetId,
        type: 'invalid-type', // Invalid type
        date: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/api/v1/activity-tracking')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/activity-tracking/pet/:petId', () => {
    it('should return activities for a pet', async () => {
      const mockActivities = [
        { id: '1', type: 'walk', petId: mockPetId },
        { id: '2', type: 'feeding', petId: mockPetId },
      ];

      (prismaService.activity.findMany as jest.Mock).mockResolvedValue(mockActivities);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/activity-tracking/pet/${mockPetId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toEqual(mockActivities);
    });
  });

  describe('DELETE /api/v1/activity-tracking/:id', () => {
    it('should delete an activity', async () => {
      const mockActivity = { id: mockActivityId, isActive: true };
      (prismaService.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      (prismaService.activity.update as jest.Mock).mockResolvedValue({ ...mockActivity, isActive: false });

      await request(app.getHttpServer())
        .delete(`/api/v1/activity-tracking/${mockActivityId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(prismaService.activity.update).toHaveBeenCalledWith({
        where: { id: mockActivityId },
        data: { isActive: false },
      });
    });

    it('should return 404 if activity not found', async () => {
      (prismaService.activity.findUnique as jest.Mock).mockResolvedValue(null);

      await request(app.getHttpServer())
        .delete('/api/v1/activity-tracking/non-existent')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});
