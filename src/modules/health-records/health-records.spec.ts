// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { HealthRecordsService } from './health-records.service';
import { HealthRecord } from './schemas/health-record.schema';
import { PetsService } from '../pets/pets.service';

describe('HealthRecordsService', () => {
  let service: HealthRecordsService;
  let mockHealthRecordModel: any;
  let mockPetsService: any;

  const mockHealthRecord = {
    _id: '507f1f77bcf86cd799439011',
    petId: 'pet123',
    type: 'vaccination',
    title: 'Annual Vaccination',
    description: 'Rabies and DHPP vaccination',
    date: new Date('2024-01-15'),
    veterinarian: 'Dr. Smith',
    clinic: 'Pet Care Clinic',
    nextDueDate: new Date('2025-01-15'),
    attachments: [],
    weight: 25,
    temperature: 101.5,
    heartRate: 80,
    cost: 150,
    notes: 'Pet was healthy',
    isReminder: false,
    isActive: true,
    save: jest.fn().mockResolvedValue(this)
  } as any;

  const mockPet = {
    _id: 'pet123',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    ownerId: 'user123'
  };

  beforeEach(async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn()
    };

    mockHealthRecordModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockHealthRecord)
    }));
    mockHealthRecordModel.find = jest.fn(() => mockQuery);
    mockHealthRecordModel.findOne = jest.fn(() => mockQuery);
    mockHealthRecordModel.findById = jest.fn(() => mockQuery);
    mockHealthRecordModel.findByIdAndUpdate = jest.fn(() => mockQuery);

    mockPetsService = {
      findById: jest.fn(),
      findByOwner: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRecordsService,
        {
          provide: getModelToken(HealthRecord.name),
          useValue: mockHealthRecordModel,
        },
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    service = module.get<HealthRecordsService>(HealthRecordsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a health record', async () => {
      const recordData = {
        petId: '507f1f77bcf86cd799439011',
        type: 'vaccination',
        title: 'Annual Vaccination',
        date: '2024-01-15',
        nextDueDate: '2025-01-15'
      } as any;

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockHealthRecordModel.mockReturnValue({
        save: jest.fn().mockResolvedValue(mockHealthRecord)
      });

      const result = await service.create('user123', recordData);

      expect(mockPetsService.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockHealthRecordModel).toHaveBeenCalled();
      expect(result).toEqual(mockHealthRecord);
    });

    it('should create record without nextDueDate', async () => {
      const recordData = {
        petId: '507f1f77bcf86cd799439011',
        type: 'checkup',
        title: 'Regular Checkup',
        date: '2024-01-15'
      } as any;

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockHealthRecordModel.mockReturnValue({
        save: jest.fn().mockResolvedValue(mockHealthRecord)
      });

      await service.create('user123', recordData);

      expect(mockHealthRecordModel).toHaveBeenCalled();
    });
  });

  describe('findByPet', () => {
    it('should find health records by pet', async () => {
      const petId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const records = [mockHealthRecord];
      mockPetsService.findById.mockResolvedValue(mockPet);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(records)
      };
      mockHealthRecordModel.find.mockReturnValue(mockQuery);

      const result = await service.findByPet(petId, userId);

      expect(mockPetsService.findById).toHaveBeenCalledWith(petId, userId);
      expect(mockHealthRecordModel.find).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ date: -1 });
      expect(result).toEqual(records);
    });

    it('should filter by type when provided', async () => {
      const petId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      mockPetsService.findById.mockResolvedValue(mockPet);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      mockHealthRecordModel.find.mockReturnValue(mockQuery);

      await service.findByPet(petId, userId, 'vaccination');

      expect(mockHealthRecordModel.find).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find health record by id', async () => {
      const userId = new Types.ObjectId().toString();
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockHealthRecord)
      };
      mockHealthRecordModel.findOne.mockReturnValue(mockQuery);
      mockPetsService.findById.mockResolvedValue(mockPet);

      const result = await service.findById('507f1f77bcf86cd799439011', userId);

      expect(mockHealthRecordModel.findOne).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalled();
      expect(result).toEqual(mockHealthRecord);
    });

    it('should throw NotFoundException when record not found', async () => {
      const userId = new Types.ObjectId().toString();
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      };
      mockHealthRecordModel.findOne.mockReturnValue(mockQuery);

      await expect(service.findById('nonexistent', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a health record', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedRecord = { ...mockHealthRecord, title: 'Updated Title' };

      jest.spyOn(service, 'findById').mockResolvedValue(mockHealthRecord);
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(updatedRecord)
      };
      mockHealthRecordModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.update('507f1f77bcf86cd799439011', 'user123', updateData);

      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockHealthRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedRecord);
    });
  });

  describe('delete', () => {
    it('should soft delete a health record', async () => {
      const deletedRecord = { ...mockHealthRecord, isActive: false };

      jest.spyOn(service, 'findById').mockResolvedValue(mockHealthRecord);
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(deletedRecord)
      };
      mockHealthRecordModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.delete('507f1f77bcf86cd799439011', 'user123');

      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockHealthRecordModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { isActive: false },
        { new: true }
      );
      expect(result).toEqual(deletedRecord);
    });
  });

  describe('getUpcomingReminders', () => {
    it('should get upcoming reminders', async () => {
      const userId = new Types.ObjectId().toString();
      const userPets = [mockPet];
      const reminders = [mockHealthRecord];

      mockPetsService.findByOwner.mockResolvedValue(userPets);
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(reminders)
      };
      mockHealthRecordModel.find.mockReturnValue(mockQuery);

      const result = await service.getUpcomingReminders(userId);

      expect(mockHealthRecordModel.find).toHaveBeenCalled();
      expect(mockQuery.populate).toHaveBeenCalled();
      expect(mockQuery.sort).toHaveBeenCalledWith({ nextDueDate: 1 });
      expect(result).toEqual(reminders);
    });
  });

  describe('getVaccinations', () => {
    it('should get vaccination records', async () => {
      const vaccinations = [mockHealthRecord];

      mockPetsService.findById.mockResolvedValue(mockPet);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(vaccinations)
      };
      mockHealthRecordModel.find.mockReturnValue(mockQuery);

      const result = await service.getVaccinations('pet123', 'user123');

      expect(mockPetsService.findById).toHaveBeenCalledWith('pet123', 'user123');
      expect(mockHealthRecordModel.find).toHaveBeenCalledWith({
        petId: 'pet123',
        type: 'vaccination',
        isActive: true
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ date: -1 });
      expect(result).toEqual(vaccinations);
    });
  });

  describe('getHealthSummary', () => {
    it('should get health summary', async () => {
      const petId = new Types.ObjectId().toString();
      const userId = new Types.ObjectId().toString();
      const records = [
        { ...mockHealthRecord, type: 'vaccination' },
        { ...mockHealthRecord, type: 'checkup', date: new Date('2024-02-01') },
        { ...mockHealthRecord, type: 'vaccination' }
      ];

      mockPetsService.findById.mockResolvedValue(mockPet);
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(records)
      };
      mockHealthRecordModel.find.mockReturnValue(mockQuery);

      const result = await service.getHealthSummary(petId, userId);

      expect(mockPetsService.findById).toHaveBeenCalledWith(petId, userId);
      expect(mockHealthRecordModel.find).toHaveBeenCalled();
      expect(result).toEqual({
        totalRecords: 3,
        recordsByType: {
          vaccination: 2,
          checkup: 1
        },
        lastCheckup: new Date('2024-02-01'),
        nextReminder: undefined,
        upcomingCount: 0,
        overdueCount: 3,
        totalCost: 450,
        weightHistory: [
          { date: new Date('2024-01-15'), weight: 25 },
          { date: new Date('2024-01-15'), weight: 25 },
          { date: new Date('2024-02-01'), weight: 25 }
        ]
      });
    });
  });
});