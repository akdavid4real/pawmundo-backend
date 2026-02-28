import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';

describe('InsuranceService', () => {
  let service: InsuranceService;
  let prisma: PrismaService;

  const mockInsurance = {
    id: 'insurance-uuid-123',
    userId: 'user-uuid-123',
    petId: 'pet-uuid-123',
    provider: 'PetSure',
    policyNumber: 'PS123456',
    planType: 'Comprehensive',
    monthlyPremium: 50,
    deductible: 200,
    coverageLimit: 10000,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: 'active',
    isActive: true,
  };

  const mockPrismaService = {
    insurance: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    insuranceClaim: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    }
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseStorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<InsuranceService>(InsuranceService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create insurance policy successfully', async () => {
      const createDto = {
        petId: 'pet-uuid-123',
        provider: 'PetSure',
        policyNumber: 'PS123456',
        planType: 'Comprehensive',
        monthlyPremium: 50,
        deductible: 200,
        coverageLimit: 10000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      mockPrismaService.insurance.create.mockResolvedValue(mockInsurance);

      const result = await service.create('user-uuid-123', createDto as any);

      expect(mockPrismaService.insurance.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error for invalid dates', async () => {
      const createDto = {
        petId: 'pet-uuid-123',
        provider: 'PetSure',
        policyNumber: 'PS123456',
        planType: 'Comprehensive',
        monthlyPremium: 50,
        deductible: 200,
        coverageLimit: 10000,
        startDate: '2024-12-31',
        endDate: '2024-01-01', // End date before start date
      };

      await expect(service.create('user-uuid-123', createDto as any))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return insurance policy when found', async () => {
      mockPrismaService.insurance.findUnique.mockResolvedValue(mockInsurance);

      const result = await service.findById('insurance-uuid-123');

      expect(mockPrismaService.insurance.findUnique).toHaveBeenCalledWith({
        where: { id: 'insurance-uuid-123' },
        include: { pet: { select: { name: true, species: true, breed: true } } },
      });
      expect(result).toEqual(mockInsurance);
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrismaService.insurance.findUnique.mockResolvedValue(null);

      await expect(service.findById('insurance-uuid-123'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for wrong user', async () => {
      mockPrismaService.insurance.findUnique.mockResolvedValue(mockInsurance);

      await expect(service.findById('insurance-uuid-123', 'wronguser'))
        .rejects.toThrow(ForbiddenException);
    });
  });

  describe('checkCoverage', () => {
    it('should calculate coverage correctly', async () => {
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setMonth(pastDate.getMonth() - 1);
      const futureDate = new Date(today);
      futureDate.setMonth(futureDate.getMonth() + 1);
      
      const activeInsurance = {
        ...mockInsurance,
        status: 'insurance_active',
        startDate: pastDate,
        endDate: futureDate,
        userId: 'user-uuid-123'
      };
      
      mockPrismaService.insurance.findUnique.mockResolvedValue(activeInsurance);

      const result = await service.checkCoverage('insurance-uuid-123', 'user-uuid-123', 1000);
      
      expect(result.covered).toBe(true);
      expect(result.coverageAmount).toBe(800); // 1000 - 200 deductible
      expect(result.deductible).toBe(200);
    });
  });
});