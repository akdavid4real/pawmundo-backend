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
      const ownerId = new Types.ObjectId().toString();
      const pets = [mockPet];
      mockPetModel.exec.mockResolvedValue(pets);

      const result = await service.findByOwner(ownerId);

      expect(mockPetModel.find).toHaveBeenCalled();
      expect(mockPetModel.sort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual(pets);
    });

    it('should filter by species when provided', async () => {
      const ownerId = new Types.ObjectId().toString();
      const pets = [mockPet];
      mockPetModel.exec.mockResolvedValue(pets);

      await service.findByOwner(ownerId, 'dog');

      expect(mockPetModel.find).toHaveBeenCalled();
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
      const ownerId = new Types.ObjectId();
      const differentOwnerId = new Types.ObjectId();
      const petWithDifferentOwner = { ...mockPet, ownerId: { equals: jest.fn().mockReturnValue(false), toString: () => differentOwnerId.toString() } };
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithDifferentOwner) });

      await expect(service.findById('petId123', ownerId.toString())).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update pet successfully', async () => {
      const ownerId = new Types.ObjectId();
      const updateData = { name: 'Updated Buddy' };
      const updatedPet = { ...mockPet, ...updateData };
      const petWithOwner = { ...mockPet, ownerId: { equals: jest.fn().mockReturnValue(true) } };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithOwner) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedPet) });

      const result = await service.update('petId123', ownerId.toString(), updateData);

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', updateData, { new: true });
      expect(result).toEqual(updatedPet);
    });
  });

  describe('delete', () => {
    it('should soft delete pet successfully', async () => {
      const ownerId = new Types.ObjectId();
      const deletedPet = { ...mockPet, isActive: false };
      const petWithOwner = { ...mockPet, ownerId: { equals: jest.fn().mockReturnValue(true) } };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithOwner) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(deletedPet) });

      const result = await service.delete('petId123', ownerId.toString());

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', { isActive: false }, { new: true });
      expect(result).toEqual(deletedPet);
    });
  });

  describe('updateHealthStatus', () => {
    it('should update health status successfully', async () => {
      const ownerId = new Types.ObjectId();
      const updatedPet = { ...mockPet, healthStatus: 'sick' };
      const petWithOwner = { ...mockPet, ownerId: { equals: jest.fn().mockReturnValue(true) } };
      
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithOwner) });
      mockPetModel.findByIdAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updatedPet) });

      const result = await service.updateHealthStatus('petId123', ownerId.toString(), 'sick');

      expect(mockPetModel.findByIdAndUpdate).toHaveBeenCalledWith('petId123', { healthStatus: 'sick' }, { new: true });
      expect(result).toEqual(updatedPet);
    });

    it('should throw error for invalid health status', async () => {
      const ownerId = new Types.ObjectId();
      const petWithOwner = { ...mockPet, ownerId: { equals: jest.fn().mockReturnValue(true) } };
      mockPetModel.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(petWithOwner) });

      await expect(service.updateHealthStatus('petId123', ownerId.toString(), 'invalid')).rejects.toThrow('Invalid health status');
    });
  });

  describe('findByHealthStatus', () => {
    it('should return pets by health status', async () => {
      const ownerId = new Types.ObjectId().toString();
      const sickPets = [{ ...mockPet, healthStatus: 'sick' }];
      mockPetModel.exec.mockResolvedValue(sickPets);

      const result = await service.findByHealthStatus(ownerId, 'sick');

      expect(mockPetModel.find).toHaveBeenCalled();
      expect(result).toEqual(sickPets);
    });
  });
});