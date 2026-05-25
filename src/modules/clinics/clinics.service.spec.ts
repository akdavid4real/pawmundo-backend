import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClinicVerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicsService } from './clinics.service';

describe('ClinicsService', () => {
  let service: ClinicsService;

  const mockPrismaService = {
    clinic: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    clinicMembership: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    appointment: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    consultation: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ClinicsService>(ClinicsService);
    jest.clearAllMocks();
  });

  describe('listPlatformClinics', () => {
    it('should filter and paginate platform clinic results', async () => {
      mockPrismaService.clinic.findMany.mockResolvedValue([{ id: 'clinic-1', name: 'Main Clinic' }]);
      mockPrismaService.clinic.count.mockResolvedValue(1);

      const result = await service.listPlatformClinics({
        q: 'main',
        verificationStatus: 'approved',
        isActive: 'true',
        page: 2,
        limit: 10,
      });

      expect(mockPrismaService.clinic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            verificationStatus: 'approved',
            isActive: true,
            OR: expect.any(Array),
          }),
          skip: 10,
          take: 10,
        }),
      );
      expect(result.pagination).toEqual({ page: 2, limit: 10, total: 1, totalPages: 1 });
    });
  });

  describe('suspendClinic', () => {
    it('should suspend clinic access without deleting the clinic', async () => {
      mockPrismaService.clinic.findUnique.mockResolvedValue({ id: 'clinic-1' });
      mockPrismaService.clinic.update.mockResolvedValue({
        id: 'clinic-1',
        isActive: false,
        rejectionReason: 'Compliance issue',
      });

      const result = await service.suspendClinic('clinic-1', 'Compliance issue');

      expect(mockPrismaService.clinic.update).toHaveBeenCalledWith({
        where: { id: 'clinic-1' },
        data: { isActive: false, rejectionReason: 'Compliance issue' },
        include: expect.any(Object),
      });
      expect(result.isActive).toBe(false);
    });

    it('should throw when clinic does not exist', async () => {
      mockPrismaService.clinic.findUnique.mockResolvedValue(null);

      await expect(service.suspendClinic('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reactivateClinic', () => {
    it('should reactivate approved clinics', async () => {
      mockPrismaService.clinic.findUnique.mockResolvedValue({
        id: 'clinic-1',
        verificationStatus: ClinicVerificationStatus.approved,
      });
      mockPrismaService.clinic.update.mockResolvedValue({
        id: 'clinic-1',
        isActive: true,
        rejectionReason: null,
      });

      const result = await service.reactivateClinic('clinic-1');

      expect(mockPrismaService.clinic.update).toHaveBeenCalledWith({
        where: { id: 'clinic-1' },
        data: { isActive: true, rejectionReason: null },
        include: expect.any(Object),
      });
      expect(result.isActive).toBe(true);
    });

    it('should not reactivate pending clinics', async () => {
      mockPrismaService.clinic.findUnique.mockResolvedValue({
        id: 'clinic-1',
        verificationStatus: ClinicVerificationStatus.pending,
      });

      await expect(service.reactivateClinic('clinic-1')).rejects.toThrow(BadRequestException);
    });
  });
});
