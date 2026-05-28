import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

describe('MedicationsController', () => {
  let app: INestApplication;

  const mockMedicationsService = {
    create: jest.fn(),
    findActive: jest.fn(),
    findByPet: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    markCompleted: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MedicationsController],
      providers: [{ provide: MedicationsService, useValue: mockMedicationsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: context => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'user-uuid-123', role: 'user' };
          return true;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  it('routes POST /medications to create medication', async () => {
    mockMedicationsService.create.mockResolvedValue({ id: 'medication-id' });

    await request(app.getHttpServer())
      .post('/medications')
      .send({ petId: 'pet-id', name: 'Amoxicillin' })
      .expect(201)
      .expect({ id: 'medication-id' });

    expect(mockMedicationsService.create).toHaveBeenCalledWith('user-uuid-123', {
      petId: 'pet-id',
      name: 'Amoxicillin',
    });
  });

  it('routes GET /medications/active to active medications', async () => {
    mockMedicationsService.findActive.mockResolvedValue([{ id: 'medication-id' }]);

    await request(app.getHttpServer())
      .get('/medications/active')
      .expect(200)
      .expect([{ id: 'medication-id' }]);

    expect(mockMedicationsService.findActive).toHaveBeenCalledWith('user-uuid-123');
    expect(mockMedicationsService.findById).not.toHaveBeenCalled();
  });

  it('routes GET /medications/pet/:petId to pet medications', async () => {
    mockMedicationsService.findByPet.mockResolvedValue([{ id: 'medication-id' }]);

    await request(app.getHttpServer())
      .get('/medications/pet/pet-id')
      .expect(200)
      .expect([{ id: 'medication-id' }]);

    expect(mockMedicationsService.findByPet).toHaveBeenCalledWith('pet-id', 'user-uuid-123');
    expect(mockMedicationsService.findById).not.toHaveBeenCalled();
  });

  it('routes PATCH /medications/:id/complete to mark completed', async () => {
    mockMedicationsService.markCompleted.mockResolvedValue({ id: 'medication-id', isCompleted: true });

    await request(app.getHttpServer())
      .patch('/medications/medication-id/complete')
      .expect(200)
      .expect({ id: 'medication-id', isCompleted: true });

    expect(mockMedicationsService.markCompleted).toHaveBeenCalledWith('medication-id', 'user-uuid-123');
    expect(mockMedicationsService.update).not.toHaveBeenCalled();
  });

  it('still routes GET /medications/:id to medication detail', async () => {
    mockMedicationsService.findById.mockResolvedValue({ id: 'medication-id' });

    await request(app.getHttpServer())
      .get('/medications/medication-id')
      .expect(200)
      .expect({ id: 'medication-id' });

    expect(mockMedicationsService.findById).toHaveBeenCalledWith('medication-id', 'user-uuid-123');
  });
});
