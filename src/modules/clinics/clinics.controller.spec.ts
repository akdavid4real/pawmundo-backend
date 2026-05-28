import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';

describe('ClinicsController', () => {
  let app: INestApplication;

  const mockClinicsService = {
    search: jest.fn(),
    registerClinic: jest.fn(),
    requestVetMembership: jest.fn(),
    listApprovedClinicVets: jest.fn(),
    getMyClinicContext: jest.fn(),
    getAdminDashboard: jest.fn(),
    listClinicVets: jest.fn(),
    createClinicVet: jest.fn(),
    approveVet: jest.fn(),
    suspendVet: jest.fn(),
    removeVet: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ClinicsController],
      providers: [{ provide: ClinicsService, useValue: mockClinicsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: context => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 'clinic-admin-user-id', role: 'clinic_admin' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app.close();
  });

  it('routes GET /clinics/admin/vets to the clinic admin vet list', async () => {
    mockClinicsService.listClinicVets.mockResolvedValue([{ id: 'membership-id' }]);

    await request(app.getHttpServer())
      .get('/clinics/admin/vets')
      .expect(200)
      .expect([{ id: 'membership-id' }]);

    expect(mockClinicsService.listClinicVets).toHaveBeenCalledWith('clinic-admin-user-id');
    expect(mockClinicsService.listApprovedClinicVets).not.toHaveBeenCalled();
  });

  it('routes GET /clinics/:clinicId/vets to the public approved clinic vet list', async () => {
    mockClinicsService.listApprovedClinicVets.mockResolvedValue([{ id: 'vet-membership-id' }]);

    await request(app.getHttpServer())
      .get('/clinics/clinic-uuid-123/vets')
      .expect(200)
      .expect([{ id: 'vet-membership-id' }]);

    expect(mockClinicsService.listApprovedClinicVets).toHaveBeenCalledWith('clinic-uuid-123');
    expect(mockClinicsService.listClinicVets).not.toHaveBeenCalled();
  });
});
