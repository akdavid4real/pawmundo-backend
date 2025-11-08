import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InsuranceService } from './insurance.service';
import { Insurance } from './schemas/insurance.schema';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('InsuranceService', () => {
  let service: InsuranceService;
  let model: Model<Insurance>;

  const mockInsurance = {
    _id: '507f1f77bcf86cd799439011',
    userId: '507f1f77bcf86cd799439012',
    petId: '507f1f77bcf86cd799439013',
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
    save: jest.fn().mockResolvedValue(this),
  };

  const mockModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: '507f1f77bcf86cd799439011' }),
  }));
  
  mockModel.find = jest.fn();
  mockModel.findById = jest.fn();
  mockModel.findByIdAndUpdate = jest.fn();
  mockModel.create = jest.fn();
  mockModel.exec = jest.fn();
  mockModel.populate = jest.fn();
  mockModel.sort = jest.fn();
  
  const mockClaimModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'claim123' }),
  }));
  
  mockClaimModel.find = jest.fn();
  mockClaimModel.findById = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceService,
        {
          provide: getModelToken(Insurance.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken('InsuranceClaim'),
          useValue: mockClaimModel,
        },
      ],
    }).compile();

    service = module.get<InsuranceService>(InsuranceService);
    model = module.get<Model<Insurance>>(getModelToken(Insurance.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create insurance policy successfully', async () => {
      const createDto = {
        petId: '507f1f77bcf86cd799439013',
        provider: 'PetSure',
        policyNumber: 'PS123456',
        planType: 'Comprehensive',
        monthlyPremium: 50,
        deductible: 200,
        coverageLimit: 10000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      jest.spyOn(model, 'constructor' as any).mockImplementationOnce(() => ({
        save: jest.fn().mockResolvedValue(mockInsurance),
      }));

      const result = await service.create('507f1f77bcf86cd799439012', createDto);
      expect(result).toBeDefined();
    });

    it('should throw error for invalid dates', async () => {
      const createDto = {
        petId: '507f1f77bcf86cd799439013',
        provider: 'PetSure',
        policyNumber: 'PS123456',
        planType: 'Comprehensive',
        monthlyPremium: 50,
        deductible: 200,
        coverageLimit: 10000,
        startDate: '2024-12-31',
        endDate: '2024-01-01',
      };

      await expect(service.create('507f1f77bcf86cd799439012', createDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should return insurance policy when found', async () => {
      mockModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockInsurance),
        }),
      });

      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockInsurance);
    });

    it('should throw NotFoundException when not found', async () => {
      mockModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findById('507f1f77bcf86cd799439011'))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException for wrong user', async () => {
      mockModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockInsurance),
        }),
      });

      await expect(service.findById('507f1f77bcf86cd799439011', 'wronguser'))
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
        status: 'active',
        startDate: pastDate,
        endDate: futureDate,
        userId: { toString: () => '507f1f77bcf86cd799439012' }
      };
      
      mockModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(activeInsurance),
        }),
      });

      const result = await service.checkCoverage('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', 1000);
      
      expect(result.covered).toBe(true);
      expect(result.coverageAmount).toBe(800); // 1000 - 200 deductible
      expect(result.deductible).toBe(200);
    });
  });
});