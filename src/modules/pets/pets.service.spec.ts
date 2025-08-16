import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PetsService } from './pets.service';
import { Pet } from './schemas/pet.schema';

describe('PetsService', () => {
  let service: PetsService;

  const mockPet = {
    _id: 'petId123',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    ownerId: 'ownerId123',
    healthStatus: 'healthy',
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockPetModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'petId123' })
  }));
  mockPetModel.find = jest.fn().mockReturnThis();
  mockPetModel.findById = jest.fn();
  mockPetModel.findByIdAndUpdate = jest.fn();
  mockPetModel.sort = jest.fn().mockReturnThis();
  mockPetModel.exec = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        { provide: getModelToken(Pet.name), useValue: mockPetModel },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new pet successfully', async () => {
      const petData = { name: 'Buddy', species: 'dog', ownerId: '507f1f77bcf86cd799439011' } as any;
      const savedPet = { ...petData, _id: 'petId123' };
      
      const result = await service.create(petData);

      expect(mockPetModel).toHaveBeenCalledWith(petData);
      expect(result).toEqual(savedPet);
    });
  });

  describe('findByOwner', () => {
    it('should return pets for owner', async () => {
      const pets = [mockPet];
      mockPetModel.exec.mockResolvedValue(pets);

      const result = await service.findByOwner('ownerId123');

      expect(mockPetModel.find).toHaveBeenCalledWith({ ownerId: 'ownerId123', isActive: true });
      expect(mockPetModel.sort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual(pets);
    });

    it('should filter by species when provided', async () => {
      const pets = [mockPet];
      mockPetModel.exec.mockResolvedValue(pets);

      await service.findByOwner('ownerId123', 'dog');

      expect(mockPetModel.find).toHaveBeenCalledWith({ 
        ownerId: 'ownerId123', 
        isActive: true, 
        species: 'dog' 
      });
    });
  });

  describe('findById', () => {
    it('should return pet by id', async () => {
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPet) });

      const result = await service.findById('petId123');

      expect(mockPetModel.findById).toHaveBeenCalledWith('petId123');
      expect(result).toEqual(mockPet);
    });

    it('should throw NotFoundException when pet not found', async () => {
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when owner mismatch', async () => {
      const petWithDifferentOwner = { ...mockPet, ownerId: { toString: () => 'differentOwner' } };
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithDifferentOwner) });

      await expect(service.findById('petId123', 'ownerId123')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update pet successfully', async () => {
      const updateData = { name: 'Updated Buddy' };
      const updatedPet = { ...mockPet, ...updateData };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPet) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedPet) });

      const result = await service.update('petId123', 'ownerId123', updateData);

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', updateData, { new: true });
      expect(result).toEqual(updatedPet);
    });
  });

  describe('delete', () => {
    it('should soft delete pet successfully', async () => {
      const deletedPet = { ...mockPet, isActive: false };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPet) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(deletedPet) });

      const result = await service.delete('petId123', 'ownerId123');

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', { isActive: false }, { new: true });
      expect(result).toEqual(deletedPet);
    });
  });

  describe('updateHealthStatus', () => {
    it('should update health status successfully', async () => {
      const updatedPet = { ...mockPet, healthStatus: 'sick' };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPet) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedPet) });

      const result = await service.updateHealthStatus('petId123', 'ownerId123', 'sick');

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', { healthStatus: 'sick' }, { new: true });
      expect(result).toEqual(updatedPet);
    });

    it('should throw error for invalid health status', async () => {
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockPet) });

      await expect(service.updateHealthStatus('petId123', 'ownerId123', 'invalid')).rejects.toThrow('Invalid health status');
    });
  });

  describe('findByHealthStatus', () => {
    it('should return pets by health status', async () => {
      const sickPets = [{ ...mockPet, healthStatus: 'sick' }];
      mockPetModel.exec.mockResolvedValue(sickPets);

      const result = await service.findByHealthStatus('ownerId123', 'sick');

      expect(mockPetModel.find).toHaveBeenCalledWith({ 
        ownerId: 'ownerId123', 
        healthStatus: 'sick', 
        isActive: true 
      });
      expect(result).toEqual(sickPets);
    });
  });
});