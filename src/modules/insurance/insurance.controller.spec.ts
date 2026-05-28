import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InsuranceController } from './insurance.controller';
import { InsuranceService } from './insurance.service';

describe('InsuranceController', () => {
  let app: INestApplication;

  const mockInsuranceService = {
    create: jest.fn(),
    findByUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    delete: jest.fn(),
    findActivePoliciesByPet: jest.fn(),
    checkCoverage: jest.fn(),
    submitClaim: jest.fn(),
    getUserClaims: jest.fn(),
    getClaimById: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [InsuranceController],
      providers: [{ provide: InsuranceService, useValue: mockInsuranceService }],
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

  it('routes GET /insurance/pet/:petId/active to active policies instead of :id', async () => {
    mockInsuranceService.findActivePoliciesByPet.mockResolvedValue([{ id: 'policy-id' }]);

    await request(app.getHttpServer())
      .get('/insurance/pet/pet-uuid-123/active')
      .expect(200)
      .expect([{ id: 'policy-id' }]);

    expect(mockInsuranceService.findActivePoliciesByPet).toHaveBeenCalledWith('pet-uuid-123', 'user-uuid-123');
    expect(mockInsuranceService.findById).not.toHaveBeenCalled();
  });

  it('routes GET /insurance/claims to claim list instead of :id', async () => {
    mockInsuranceService.getUserClaims.mockResolvedValue([{ id: 'claim-id' }]);

    await request(app.getHttpServer())
      .get('/insurance/claims?status=submitted')
      .expect(200)
      .expect([{ id: 'claim-id' }]);

    expect(mockInsuranceService.getUserClaims).toHaveBeenCalledWith('user-uuid-123', 'submitted');
    expect(mockInsuranceService.findById).not.toHaveBeenCalled();
  });

  it('routes GET /insurance/claims/:claimId to claim detail instead of :id', async () => {
    mockInsuranceService.getClaimById.mockResolvedValue({ id: 'claim-id' });

    await request(app.getHttpServer())
      .get('/insurance/claims/claim-id')
      .expect(200)
      .expect({ id: 'claim-id' });

    expect(mockInsuranceService.getClaimById).toHaveBeenCalledWith('claim-id', 'user-uuid-123');
    expect(mockInsuranceService.findById).not.toHaveBeenCalled();
  });

  it('still routes GET /insurance/:id to policy detail', async () => {
    mockInsuranceService.findById.mockResolvedValue({ id: 'policy-id' });

    await request(app.getHttpServer())
      .get('/insurance/policy-id')
      .expect(200)
      .expect({ id: 'policy-id' });

    expect(mockInsuranceService.findById).toHaveBeenCalledWith('policy-id', 'user-uuid-123');
  });
});
