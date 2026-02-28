import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { HealthRecordsService } from './health-records.service';
import { PetsService } from '../pets/pets.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthRecordsService', () => {
  let service: HealthRecordsService;
  let prisma: PrismaService;
  let petsService: PetsService;

  const mockHealthRecord = {
    id: 'record-uuid-123',
    petId: 'pet-uuid-123',
    type: 'vaccination',
    title: 'Annual Vaccination',
    description: 'Yearly shots given',
    date: new Date('2024-01-15'),
    veterinarian: 'Dr. Smith',
    clinic: 'Happy Paws Clinic',
    nextDueDate: new Date('2025-01-15'),
    weight: 25.5,
    temperature: 101.5,
    heartRate: 80,
    cost: 150.0,
    notes: 'Pet was healthy',
    isReminder: false,
    isActive: true,
  };

  const mockPet = {
    id: 'pet-uuid-123',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    ownerId: 'user-uuid-123',
    isActive: true,
  };

  const mockPrismaService = {
    healthRecord: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPetsService = {
    findById: jest.fn(),
    findByOwner: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRecordsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PetsService, useValue: mockPetsService },
      ],
    }).compile();

    service = module.get<HealthRecordsService>(HealthRecordsService);
    prisma = module.get<PrismaService>(PrismaService);
    petsService = module.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a health record', async () => {
      const recordData = {
        petId: 'pet-uuid-123',
        type: 'vaccination',
        title: 'Annual Vaccination',
        date: '2024-01-15',
        nextDueDate: '2025-01-15'
      } as any;

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.create.mockResolvedValue(mockHealthRecord);

      const result = await service.create('user-uuid-123', recordData);

      expect(mockPetsService.findById).toHaveBeenCalledWith('pet-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.healthRecord.create).toHaveBeenCalled();
      expect(result).toEqual(mockHealthRecord);
    });

    it('should create record without nextDueDate', async () => {
      const recordData = {
        petId: 'pet-uuid-123',
        type: 'checkup',
        title: 'Regular Checkup',
        date: '2024-01-15'
      } as any;

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.create.mockResolvedValue(mockHealthRecord);

      await service.create('user-uuid-123', recordData);

      expect(mockPrismaService.healthRecord.create).toHaveBeenCalled();
    });
  });

  describe('findByPet', () => {
    it('should find health records by pet', async () => {
      const petId = 'pet-uuid-123';
      const userId = 'user-uuid-123';
      const records = [mockHealthRecord];

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.findMany.mockResolvedValue(records);

      // Note: The method signature in health-records.service.ts is findByPet(petId: string, userId: string, type?: string)
      // BUT its implementation actually doesn't use the 'userId' parameter correctly in findMany, it uses 'petId'.
      const result = await service.findByPet(petId, userId);

      expect(mockPetsService.findById).toHaveBeenCalledWith(petId, userId);
      expect(mockPrismaService.healthRecord.findMany).toHaveBeenCalledWith({
        where: { petId, isActive: true },
        orderBy: { date: 'desc' }
      });
      expect(result).toEqual(records);
    });

    it('should filter by type when provided', async () => {
      const petId = 'pet-uuid-123';
      const userId = 'user-uuid-123';

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.findMany.mockResolvedValue([mockHealthRecord]);

      await service.findByPet(petId, userId, 'vaccination');

      expect(mockPrismaService.healthRecord.findMany).toHaveBeenCalledWith({
        where: { petId, isActive: true, type: 'vaccination' },
        orderBy: { date: 'desc' }
      });
    });
  });

  describe('findById', () => {
    it('should find health record by id', async () => {
      const userId = 'user-uuid-123';
      const recordWithPet = { ...mockHealthRecord, pet: mockPet };

      // In the service, findById uses findFirst, not findUnique.
      mockPrismaService.healthRecord.findFirst.mockResolvedValue(recordWithPet);

      const result = await service.findById('record-uuid-123', userId);

      expect(mockPrismaService.healthRecord.findFirst).toHaveBeenCalled();
      expect(result).toEqual(recordWithPet);
    });

    it('should throw NotFoundException when record not found', async () => {
      const userId = 'user-uuid-123';

      mockPrismaService.healthRecord.findFirst.mockResolvedValue(null);

      await expect(service.findById('nonexistent', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a health record', async () => {
      const updateData = { title: 'Updated Title' };
      const updatedRecord = { ...mockHealthRecord, title: 'Updated Title' };

      jest.spyOn(service, 'findById').mockResolvedValue(mockHealthRecord as any);
      mockPrismaService.healthRecord.update.mockResolvedValue(updatedRecord);

      const result = await service.update('record-uuid-123', 'user-uuid-123', updateData);

      expect(service.findById).toHaveBeenCalledWith('record-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.healthRecord.update).toHaveBeenCalledWith({
        where: { id: 'record-uuid-123' },
        data: updateData
      });
      expect(result).toEqual(updatedRecord);
    });
  });

  describe('delete', () => {
    it('should soft delete a health record', async () => {
      const deletedRecord = { ...mockHealthRecord, isActive: false };

      jest.spyOn(service, 'findById').mockResolvedValue(mockHealthRecord as any);
      mockPrismaService.healthRecord.update.mockResolvedValue(deletedRecord);

      const result = await service.delete('record-uuid-123', 'user-uuid-123');

      expect(service.findById).toHaveBeenCalledWith('record-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.healthRecord.update).toHaveBeenCalledWith({
        where: { id: 'record-uuid-123' },
        data: { isActive: false }
      });
      expect(result).toEqual(deletedRecord);
    });
  });

  describe('getUpcomingReminders', () => {
    it('should get upcoming reminders', async () => {
      const userId = 'user-uuid-123';
      const reminders = [{ ...mockHealthRecord, pet: mockPet }];

      mockPrismaService.healthRecord.findMany.mockResolvedValue(reminders);

      const result = await service.getUpcomingReminders(userId);

      expect(mockPrismaService.healthRecord.findMany).toHaveBeenCalled();
      expect(result).toEqual(reminders);
    });
  });

  describe('getVaccinations', () => {
    it('should get vaccination records', async () => {
      const vaccinations = [mockHealthRecord];

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.findMany.mockResolvedValue(vaccinations);

      const result = await service.getVaccinations('pet-uuid-123', 'user-uuid-123');

      expect(mockPetsService.findById).toHaveBeenCalledWith('pet-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.healthRecord.findMany).toHaveBeenCalledWith({
        where: {
          petId: 'pet-uuid-123',
          type: 'vaccination',
          isActive: true
        },
        orderBy: { date: 'desc' }
      });
      expect(result).toEqual(vaccinations);
    });
  });

  describe('getHealthSummary', () => {
    it('should get health summary', async () => {
      const petId = 'pet-uuid-123';
      const userId = 'user-uuid-123';
      const records = [
        { ...mockHealthRecord, type: 'vaccination', date: new Date('2024-01-15') },
        { ...mockHealthRecord, type: 'checkup', date: new Date('2024-02-01') },
        { ...mockHealthRecord, type: 'vaccination', date: new Date('2024-01-15') }
      ];

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.healthRecord.findMany.mockResolvedValue(records);

      const result = await service.getHealthSummary(petId, userId);

      expect(mockPetsService.findById).toHaveBeenCalledWith(petId, userId);
      expect(mockPrismaService.healthRecord.findMany).toHaveBeenCalled();
      expect(result.totalRecords).toBe(3);
      expect(result.recordsByType).toEqual({
        vaccination: 2,
        checkup: 1
      });
      expect(result.weightHistory).toBeDefined();
    });
  });
});
