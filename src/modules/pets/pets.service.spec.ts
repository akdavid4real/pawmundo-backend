import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';

describe('PetsService', () => {
  let service: PetsService;
  let prisma: PrismaService;

  const mockPet = {
    id: 'test-pet-uuid',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    ownerId: 'test-owner-uuid',
    healthStatus: 'healthy',
    isActive: true,
  };

  const mockPrismaService = {
    pet: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    petPhoto: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    }
  };

  const mockStorageService = {
    uploadFile: jest.fn(),
    deleteFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SupabaseStorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new pet successfully', async () => {
      const petData = { name: 'Buddy', species: 'dog', ownerId: 'test-owner-uuid' };
      const savedPet = { ...petData, id: 'test-pet-uuid' };
      
      mockPrismaService.pet.create.mockResolvedValue(savedPet);

      const result = await service.create(petData);

      expect(mockPrismaService.pet.create).toHaveBeenCalledWith({ data: petData });
      expect(result).toEqual(savedPet);
    });
  });

  describe('findByOwner', () => {
    it('should return pets for owner', async () => {
      const ownerId = 'test-owner-uuid';
      const pets = [mockPet];
      mockPrismaService.pet.findMany.mockResolvedValue(pets);

      const result = await service.findByOwner(ownerId);

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith({
        where: { ownerId, isActive: true },
        orderBy: { name: 'asc' }
      });
      expect(result).toEqual(pets);
    });

    it('should filter by species when provided', async () => {
      const ownerId = 'test-owner-uuid';
      mockPrismaService.pet.findMany.mockResolvedValue([mockPet]);

      await service.findByOwner(ownerId, 'dog');

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith({
         where: { ownerId, isActive: true, species: 'dog' },
         orderBy: { name: 'asc' }
      });
    });
  });

  describe('findById', () => {
    it('should return pet by id', async () => {
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

      const result = await service.findById('test-pet-uuid');

      expect(mockPrismaService.pet.findUnique).toHaveBeenCalledWith({ where: { id: 'test-pet-uuid'} });
      expect(result).toEqual(mockPet);
    });

    it('should throw NotFoundException when pet not found', async () => {
      mockPrismaService.pet.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when owner mismatch', async () => {
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

      await expect(service.findById('test-pet-uuid', 'different-owner-uuid')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update pet successfully', async () => {
      const updateData = { name: 'Updated Buddy' };
      const updatedPet = { ...mockPet, ...updateData };
      
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);
      mockPrismaService.pet.update.mockResolvedValue(updatedPet);

      const result = await service.update('test-pet-uuid', 'test-owner-uuid', updateData);

      expect(mockPrismaService.pet.update).toHaveBeenCalledWith({ where: { id: 'test-pet-uuid'}, data: updateData });
      expect(result).toEqual(updatedPet);
    });
  });

  describe('delete', () => {
    it('should soft delete pet successfully', async () => {
      const deletedPet = { ...mockPet, isActive: false };
      
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);
      mockPrismaService.pet.update.mockResolvedValue(deletedPet);

      const result = await service.delete('test-pet-uuid', 'test-owner-uuid');

      expect(mockPrismaService.pet.update).toHaveBeenCalledWith({ where: { id: 'test-pet-uuid'}, data: { isActive: false } });
      expect(result).toEqual(deletedPet);
    });
  });

  describe('updateHealthStatus', () => {
    it('should update health status successfully', async () => {
      const updatedPet = { ...mockPet, healthStatus: 'sick' };
      
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);
      mockPrismaService.pet.update.mockResolvedValue(updatedPet);

      const result = await service.updateHealthStatus('test-pet-uuid', 'test-owner-uuid', 'sick');

      expect(mockPrismaService.pet.update).toHaveBeenCalledWith({ where: { id: 'test-pet-uuid'}, data: { healthStatus: 'sick' } });
      expect(result).toEqual(updatedPet);
    });

    it('should throw error for invalid health status', async () => {
      mockPrismaService.pet.findUnique.mockResolvedValue(mockPet);

      await expect(service.updateHealthStatus('test-pet-uuid', 'test-owner-uuid', 'invalid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByHealthStatus', () => {
    it('should return pets by health status', async () => {
      const sickPets = [{ ...mockPet, healthStatus: 'sick' }];
      mockPrismaService.pet.findMany.mockResolvedValue(sickPets);

      const result = await service.findByHealthStatus('test-owner-uuid', 'sick');

      expect(mockPrismaService.pet.findMany).toHaveBeenCalledWith({
         where: { ownerId: 'test-owner-uuid', healthStatus: 'sick', isActive: true }
      });
      expect(result).toEqual(sickPets);
    });
  });
});
