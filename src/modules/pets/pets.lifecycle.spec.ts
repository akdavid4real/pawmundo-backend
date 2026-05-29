import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

describe('Pets lifecycle DB-free coverage', () => {
  const ownerId = 'owner-id';
  const otherOwnerId = 'other-owner-id';
  const petId = 'pet-id';

  const activePet = {
    id: petId,
    name: 'Milo',
    species: 'cat',
    breed: 'Tabby',
    age: 3,
    gender: 'male',
    ownerId,
    healthStatus: 'healthy',
    isActive: true,
  };

  let prisma: any;
  let storageService: any;
  let entitlementsService: any;
  let service: PetsService;
  let controller: PetsController;

  beforeEach(() => {
    prisma = {
      pet: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      petPhoto: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };
    storageService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };
    entitlementsService = {
      requireCanCreatePet: jest.fn().mockResolvedValue(undefined),
      requirePhotoGallery: jest.fn().mockResolvedValue(undefined),
    };

    service = new PetsService(prisma, storageService, entitlementsService);
    controller = new PetsController(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a pet for the authenticated owner and checks the pet-limit entitlement first', async () => {
    const dto = {
      name: 'Milo',
      species: 'cat',
      breed: 'Tabby',
      age: 3,
      gender: 'male',
      dateOfBirth: '2023-01-01T00:00:00.000Z',
    };
    prisma.pet.create.mockResolvedValueOnce({ ...activePet, dateOfBirth: new Date(dto.dateOfBirth) });

    const result = await controller.create({ user: { id: ownerId } }, dto as any);

    expect(entitlementsService.requireCanCreatePet).toHaveBeenCalledWith(ownerId);
    expect(prisma.pet.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ownerId,
        name: 'Milo',
        dateOfBirth: new Date(dto.dateOfBirth),
      }),
    });
    expect(result.ownerId).toBe(ownerId);
  });

  it('lists only active owned pets and forwards species filters', async () => {
    prisma.pet.findMany.mockResolvedValueOnce([activePet]);

    const result = await controller.findMyPets({ user: { id: ownerId } }, 'cat');

    expect(prisma.pet.findMany).toHaveBeenCalledWith({
      where: { ownerId, isActive: true, species: 'cat' },
      orderBy: { name: 'asc' },
    });
    expect(result).toEqual([activePet]);
  });

  it('reads a pet detail only for the owner', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);

    await expect(controller.findOne(petId, { user: { id: ownerId } })).resolves.toEqual(activePet);
    expect(prisma.pet.findUnique).toHaveBeenCalledWith({ where: { id: petId } });
  });

  it('rejects another user reading a pet detail', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);

    await expect(controller.findOne(petId, { user: { id: otherOwnerId } })).rejects.toThrow(ForbiddenException);
  });

  it('rejects inactive pets as not found', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({ ...activePet, isActive: false });

    await expect(controller.findOne(petId, { user: { id: ownerId } })).rejects.toThrow(NotFoundException);
  });

  it('updates editable pet fields and preserves ownership checks', async () => {
    const updateDto = { name: 'Milo Senior', weight: 4.8, dateOfBirth: '2022-01-01T00:00:00.000Z' };
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);
    prisma.pet.update.mockResolvedValueOnce({ ...activePet, name: updateDto.name, weight: updateDto.weight });

    const result = await controller.update(petId, updateDto as any, { user: { id: ownerId } });

    expect(prisma.pet.update).toHaveBeenCalledWith({
      where: { id: petId },
      data: expect.objectContaining({
        name: updateDto.name,
        weight: updateDto.weight,
        dateOfBirth: new Date(updateDto.dateOfBirth),
      }),
    });
    expect(result.name).toBe(updateDto.name);
  });

  it('patches health status and rejects unsupported status values', async () => {
    prisma.pet.findUnique.mockResolvedValue(activePet);
    prisma.pet.update.mockResolvedValueOnce({ ...activePet, healthStatus: 'sick' });

    await expect(
      controller.updateHealthStatus(petId, 'sick', { user: { id: ownerId } }),
    ).resolves.toMatchObject({ healthStatus: 'sick' });

    await expect(
      controller.updateHealthStatus(petId, 'unknown', { user: { id: ownerId } }),
    ).rejects.toThrow(BadRequestException);
  });

  it('uploads a profile image without requiring gallery entitlement', async () => {
    const file = { buffer: Buffer.from('image'), mimetype: 'image/png' } as Express.Multer.File;
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);
    storageService.uploadFile.mockResolvedValueOnce('https://storage.example/profile.png');
    prisma.pet.update.mockResolvedValueOnce({ ...activePet, profileImage: 'https://storage.example/profile.png' });

    const result = await controller.uploadProfileImage(petId, { user: { id: ownerId } }, file);

    expect(entitlementsService.requirePhotoGallery).not.toHaveBeenCalled();
    expect(storageService.uploadFile).toHaveBeenCalledWith(
      'pet-images',
      expect.stringMatching(/^pet-id\/profile_\d+\.png$/),
      file.buffer,
      'image/png',
    );
    expect(result.profileImage).toBe('https://storage.example/profile.png');
  });

  it('uploads gallery photos only after owner and tier checks pass', async () => {
    const file = { buffer: Buffer.from('image'), mimetype: 'image/jpeg' } as Express.Multer.File;
    const photo = { id: 'photo-id', petId, url: 'https://storage.example/pet-images/pet-id/photo.jpeg' };
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);
    storageService.uploadFile.mockResolvedValueOnce(photo.url);
    prisma.petPhoto.create.mockResolvedValueOnce(photo);

    const result = await controller.uploadPhoto(petId, { user: { id: ownerId } }, file, 'park day');

    expect(entitlementsService.requirePhotoGallery).toHaveBeenCalledWith(ownerId);
    expect(prisma.petPhoto.create).toHaveBeenCalledWith({
      data: { petId, url: photo.url, caption: 'park day' },
    });
    expect(result).toEqual(photo);
  });

  it('deletes only an owned gallery photo and cleans mocked storage path', async () => {
    prisma.petPhoto.findUnique.mockResolvedValueOnce({
      id: 'photo-id',
      url: 'https://storage.example/pet-images/pet-id/photo.jpeg',
      pet: activePet,
    });
    prisma.petPhoto.delete.mockResolvedValueOnce({ id: 'photo-id' });

    const result = await controller.deletePhoto(petId, 'photo-id', { user: { id: ownerId } });

    expect(storageService.deleteFile).toHaveBeenCalledWith('pet-images', 'pet-id/photo.jpeg');
    expect(prisma.petPhoto.delete).toHaveBeenCalledWith({ where: { id: 'photo-id' } });
    expect(result).toEqual({ message: 'Photo deleted successfully' });
  });

  it('rejects deleting another user gallery photo', async () => {
    prisma.petPhoto.findUnique.mockResolvedValueOnce({
      id: 'photo-id',
      url: 'https://storage.example/pet-images/pet-id/photo.jpeg',
      pet: { ...activePet, ownerId: otherOwnerId },
    });

    await expect(
      controller.deletePhoto(petId, 'photo-id', { user: { id: ownerId } }),
    ).rejects.toThrow(ForbiddenException);

    expect(storageService.deleteFile).not.toHaveBeenCalled();
    expect(prisma.petPhoto.delete).not.toHaveBeenCalled();
  });

  it('soft deletes a pet after ownership is proven', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce(activePet);
    prisma.pet.update.mockResolvedValueOnce({ ...activePet, isActive: false });

    const result = await controller.remove(petId, { user: { id: ownerId } });

    expect(prisma.pet.update).toHaveBeenCalledWith({
      where: { id: petId },
      data: { isActive: false },
    });
    expect(result.isActive).toBe(false);
  });
});
