import { NotFoundException } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClinicsService clinic admin operations', () => {
  let service: ClinicsService;

  const mockPrisma = {
    clinicMembership: {
      findFirst: jest.fn(),
    },
    pet: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    consultation: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(() => {
    service = new ClinicsService(mockPrisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const activeAdminMembership = {
    clinicId: 'clinic-id',
    clinic: { id: 'clinic-id', name: 'Clinic' },
  };

  it('lists only patients connected to the clinic admin clinic', async () => {
    mockPrisma.clinicMembership.findFirst.mockResolvedValue(activeAdminMembership);
    mockPrisma.pet.findMany.mockResolvedValue([{ id: 'pet-id' }]);

    const result = await service.listClinicPatients('admin-id', { q: 'buddy' });

    expect(result).toEqual([{ id: 'pet-id' }]);
    expect(mockPrisma.pet.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        isActive: true,
        OR: [
          { appointments: { some: { clinicId: 'clinic-id', isActive: true } } },
          { consultations: { some: { clinicId: 'clinic-id', isActive: true } } },
        ],
      }),
    }));
  });

  it('rejects clinic patient detail outside the admin clinic', async () => {
    mockPrisma.clinicMembership.findFirst.mockResolvedValue(activeAdminMembership);
    mockPrisma.pet.findFirst.mockResolvedValue(null);

    await expect(service.getClinicPatient('admin-id', 'pet-id')).rejects.toThrow(NotFoundException);

    expect(mockPrisma.pet.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        id: 'pet-id',
        OR: [
          { appointments: { some: { clinicId: 'clinic-id', isActive: true } } },
          { consultations: { some: { clinicId: 'clinic-id', isActive: true } } },
        ],
      }),
    }));
  });

  it('lists clinic consultations with status, vet, date, and patient filters scoped to the admin clinic', async () => {
    mockPrisma.clinicMembership.findFirst.mockResolvedValue(activeAdminMembership);
    mockPrisma.consultation.findMany.mockResolvedValue([{ id: 'consultation-id' }]);

    await service.listClinicConsultations('admin-id', {
      status: 'in-progress',
      vetId: 'vet-id',
      date: '2026-05-28',
      patientId: 'pet-id',
    });

    expect(mockPrisma.consultation.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({
        clinicId: 'clinic-id',
        isActive: true,
        status: 'in_progress',
        assignedVetId: 'vet-id',
        OR: [{ petId: 'pet-id' }, { userId: 'pet-id' }],
        scheduledDate: expect.objectContaining({
          gte: expect.any(Date),
          lt: expect.any(Date),
        }),
      }),
    }));
  });

  it('rejects consultation detail outside the admin clinic', async () => {
    mockPrisma.clinicMembership.findFirst.mockResolvedValue(activeAdminMembership);
    mockPrisma.consultation.findFirst.mockResolvedValue(null);

    await expect(service.getClinicConsultation('admin-id', 'consultation-id')).rejects.toThrow(NotFoundException);

    expect(mockPrisma.consultation.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'consultation-id', clinicId: 'clinic-id', isActive: true },
    }));
  });
});
