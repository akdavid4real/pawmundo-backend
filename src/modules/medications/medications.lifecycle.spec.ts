import { NotFoundException } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';

describe('Medications lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';
  const medicationId = 'medication-id';

  const pet = {
    id: petId,
    ownerId: userId,
    name: 'Milo',
    species: 'cat',
    isActive: true,
  };

  const medication = {
    id: medicationId,
    petId,
    name: 'Amoxicillin',
    dosage: '5mg',
    frequency: 'daily',
    startDate: new Date('2026-01-01T00:00:00.000Z'),
    endDate: null,
    instructions: 'Give with food',
    isActive: true,
    isCompleted: false,
    pet,
  };

  let prisma: any;
  let petsService: any;
  let service: MedicationsService;
  let controller: MedicationsController;

  beforeEach(() => {
    prisma = {
      medication: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue(pet),
      findByOwner: jest.fn().mockResolvedValue([pet]),
    };

    service = new MedicationsService(prisma, petsService);
    controller = new MedicationsController(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates medication after proving pet ownership and normalizing dates', async () => {
    prisma.medication.create.mockResolvedValueOnce(medication);

    const result = await controller.create(
      { user: { id: userId } },
      {
        petId,
        name: 'Amoxicillin',
        dosage: '5mg',
        frequency: 'daily',
        startDate: '2026-01-01T00:00:00.000Z',
        instructions: 'Give with food',
      },
    );

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.medication.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        petId,
        name: 'Amoxicillin',
        frequency: 'daily',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: undefined,
      }),
    });
    expect(result).toEqual(medication);
  });

  it('does not create medication when pet ownership lookup fails', async () => {
    petsService.findById.mockRejectedValueOnce(new NotFoundException('Pet not found'));

    await expect(
      controller.create(
        { user: { id: userId } },
        {
          petId,
          name: 'Amoxicillin',
          dosage: '5mg',
          frequency: 'daily',
          startDate: '2026-01-01T00:00:00.000Z',
        },
      ),
    ).rejects.toThrow(NotFoundException);

    expect(prisma.medication.create).not.toHaveBeenCalled();
  });

  it('lists current active medications across owned pets only', async () => {
    prisma.medication.findMany.mockResolvedValueOnce([medication]);

    const result = await controller.findActive({ user: { id: userId } });

    expect(petsService.findByOwner).toHaveBeenCalledWith(userId);
    expect(prisma.medication.findMany).toHaveBeenCalledWith({
      where: {
        petId: { in: [petId] },
        isActive: true,
        isCompleted: false,
        OR: [{ endDate: null }, { endDate: { gte: expect.any(Date) } }],
      },
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { startDate: 'desc' },
    });
    expect(result).toEqual([medication]);
  });

  it('lists medication history for an owned pet', async () => {
    prisma.medication.findMany.mockResolvedValueOnce([medication]);

    const result = await controller.findByPet(petId, { user: { id: userId } });

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.medication.findMany).toHaveBeenCalledWith({
      where: { petId, isActive: true },
      orderBy: { startDate: 'desc' },
    });
    expect(result).toEqual([medication]);
  });

  it('reads a medication only after verifying access to the linked pet', async () => {
    prisma.medication.findUnique.mockResolvedValueOnce(medication);

    const result = await controller.findOne(medicationId, { user: { id: userId } });

    expect(prisma.medication.findUnique).toHaveBeenCalledWith({
      where: { id: medicationId },
      include: { pet: true },
    });
    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(result).toEqual(medication);
  });

  it('updates medication details and converts start/end dates', async () => {
    prisma.medication.findUnique.mockResolvedValueOnce(medication);
    prisma.medication.update.mockResolvedValueOnce({
      ...medication,
      dosage: '10mg',
      endDate: new Date('2026-02-01T00:00:00.000Z'),
    });

    const result = await controller.update(
      medicationId,
      { user: { id: userId } },
      {
        dosage: '10mg',
        endDate: '2026-02-01T00:00:00.000Z',
      } as any,
    );

    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: medicationId },
      data: expect.objectContaining({
        dosage: '10mg',
        endDate: new Date('2026-02-01T00:00:00.000Z'),
      }),
    });
    expect(result.dosage).toBe('10mg');
  });

  it('marks medication completed while preserving it in history', async () => {
    prisma.medication.findUnique.mockResolvedValueOnce(medication);
    prisma.medication.update.mockResolvedValueOnce({ ...medication, isCompleted: true });

    const result = await controller.markCompleted(medicationId, { user: { id: userId } });

    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: medicationId },
      data: { isCompleted: true },
    });
    expect(result.isCompleted).toBe(true);
  });

  it('soft deletes medication by marking it inactive', async () => {
    prisma.medication.findUnique.mockResolvedValueOnce(medication);
    prisma.medication.update.mockResolvedValueOnce({ ...medication, isActive: false });

    const result = await controller.remove(medicationId, { user: { id: userId } });

    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: medicationId },
      data: { isActive: false },
    });
    expect(result.isActive).toBe(false);
  });
});
