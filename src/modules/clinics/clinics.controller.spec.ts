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
    listClinicPatients: jest.fn(),
    getClinicPatient: jest.fn(),
    listClinicConsultations: jest.fn(),
    getClinicConsultation: jest.fn(),
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

  it('routes GET /clinics/admin/patients to clinic admin patients', async () => {
    mockClinicsService.listClinicPatients.mockResolvedValue([{ id: 'pet-id' }]);

    await request(app.getHttpServer())
      .get('/clinics/admin/patients?q=buddy')
      .expect(200)
      .expect([{ id: 'pet-id' }]);

    expect(mockClinicsService.listClinicPatients).toHaveBeenCalledWith('clinic-admin-user-id', { q: 'buddy' });
    expect(mockClinicsService.listApprovedClinicVets).not.toHaveBeenCalled();
  });

  it('routes GET /clinics/admin/patients/:petId to clinic admin patient detail', async () => {
    mockClinicsService.getClinicPatient.mockResolvedValue({ id: 'pet-id' });

    await request(app.getHttpServer())
      .get('/clinics/admin/patients/pet-id')
      .expect(200)
      .expect({ id: 'pet-id' });

    expect(mockClinicsService.getClinicPatient).toHaveBeenCalledWith('clinic-admin-user-id', 'pet-id');
  });

  it('routes GET /clinics/admin/consultations to clinic admin consultations', async () => {
    mockClinicsService.listClinicConsultations.mockResolvedValue([{ id: 'consultation-id' }]);

    await request(app.getHttpServer())
      .get('/clinics/admin/consultations?status=completed&vetId=vet-id')
      .expect(200)
      .expect([{ id: 'consultation-id' }]);

    expect(mockClinicsService.listClinicConsultations).toHaveBeenCalledWith('clinic-admin-user-id', {
      status: 'completed',
      vetId: 'vet-id',
    });
    expect(mockClinicsService.listApprovedClinicVets).not.toHaveBeenCalled();
  });

  it('routes GET /clinics/admin/consultations/:consultationId to clinic admin consultation detail', async () => {
    mockClinicsService.getClinicConsultation.mockResolvedValue({ id: 'consultation-id' });

    await request(app.getHttpServer())
      .get('/clinics/admin/consultations/consultation-id')
      .expect(200)
      .expect({ id: 'consultation-id' });

    expect(mockClinicsService.getClinicConsultation).toHaveBeenCalledWith('clinic-admin-user-id', 'consultation-id');
  });
});
