import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClinicVerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlatformAdminService } from './platform-admin.service';

describe('PlatformAdminService', () => {
  let service: PlatformAdminService;

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
      updateMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatformAdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PlatformAdminService>(PlatformAdminService);
    jest.clearAllMocks();
    mockPrismaService.$transaction.mockImplementation((callback) => callback(mockPrismaService));
  });

  describe('listClinics', () => {
    it('should filter and paginate platform clinic results', async () => {
      mockPrismaService.clinic.findMany.mockResolvedValue([{ id: 'clinic-1', name: 'Main Clinic' }]);
      mockPrismaService.clinic.count.mockResolvedValue(1);

      const result = await service.listClinics({
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

  describe('approveClinic', () => {
    it('should approve the clinic and activate pending clinic admin membership', async () => {
      mockPrismaService.clinic.findUnique.mockResolvedValue({ id: 'clinic-1' });
      mockPrismaService.clinic.update.mockResolvedValue({ id: 'clinic-1', verificationStatus: 'approved' });
      mockPrismaService.clinicMembership.updateMany.mockResolvedValue({ count: 1 });

      await service.approveClinic('clinic-1', 'admin-1');

      expect(mockPrismaService.clinic.update).toHaveBeenCalledWith({
        where: { id: 'clinic-1' },
        data: { verificationStatus: 'approved', rejectionReason: null, isActive: true },
      });
      expect(mockPrismaService.clinicMembership.updateMany).toHaveBeenCalledWith({
        where: { clinicId: 'clinic-1', role: 'clinic_admin', status: 'pending' },
        data: expect.objectContaining({ status: 'active', approvedById: 'admin-1' }),
      });
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
