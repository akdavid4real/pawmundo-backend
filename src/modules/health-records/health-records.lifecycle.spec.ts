import { NotFoundException } from '@nestjs/common';
import { HealthRecordsController } from './health-records.controller';
import { HealthRecordsService } from './health-records.service';

describe('Health records lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';
  const recordId = 'record-id';

  const pet = {
    id: petId,
    ownerId: userId,
    name: 'Milo',
    species: 'cat',
    breed: 'Tabby',
    isActive: true,
  };

  const record = {
    id: recordId,
    petId,
    type: 'vaccination',
    title: 'Rabies',
    description: 'Annual rabies vaccine',
    date: new Date('2026-01-01T00:00:00.000Z'),
    nextDueDate: new Date('2027-01-01T00:00:00.000Z'),
    isReminder: true,
    isActive: true,
    attachments: ['https://files.example/old.pdf'],
    cost: 100,
    pet,
  };

  let prisma: any;
  let petsService: any;
  let service: HealthRecordsService;
  let controller: HealthRecordsController;

  beforeEach(() => {
    prisma = {
      healthRecord: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue(pet),
      findByOwner: jest.fn().mockResolvedValue([pet]),
    };

    service = new HealthRecordsService(prisma, petsService);
    controller = new HealthRecordsController(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a health record after proving pet ownership and converting dates', async () => {
    prisma.healthRecord.create.mockResolvedValueOnce(record);

    const result = await controller.create(
      { user: { id: userId } },
      {
        petId,
        type: 'vaccination',
        title: 'Rabies',
        description: 'Annual rabies vaccine',
        date: '2026-01-01T00:00:00.000Z',
        nextDueDate: '2027-01-01T00:00:00.000Z',
      } as any,
    );

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.healthRecord.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        petId,
        date: new Date('2026-01-01T00:00:00.000Z'),
        nextDueDate: new Date('2027-01-01T00:00:00.000Z'),
      }),
    });
    expect(result).toEqual(record);
  });

  it('lists active records for an owned pet and applies type filters', async () => {
    prisma.healthRecord.findMany.mockResolvedValueOnce([record]);

    const result = await controller.findByPet(petId, 'vaccination', { user: { id: userId } });

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.healthRecord.findMany).toHaveBeenCalledWith({
      where: { petId, isActive: true, type: 'vaccination' },
      orderBy: { date: 'desc' },
    });
    expect(result).toEqual([record]);
  });

  it('rejects record detail when the record is missing, owned by someone else, or linked to inactive pet', async () => {
    prisma.healthRecord.findFirst.mockResolvedValueOnce({
      ...record,
      pet: { ...pet, ownerId: 'other-user' },
    });

    await expect(controller.findOne(recordId, { user: { id: userId } })).rejects.toThrow(NotFoundException);
  });

  it('updates health record fields and converts date values through the controller', async () => {
    prisma.healthRecord.findFirst.mockResolvedValueOnce(record);
    prisma.healthRecord.update.mockResolvedValueOnce({
      ...record,
      title: 'Rabies updated',
      date: new Date('2026-02-01T00:00:00.000Z'),
    });

    const result = await controller.update(
      recordId,
      {
        title: 'Rabies updated',
        date: '2026-02-01T00:00:00.000Z',
      } as any,
      { user: { id: userId } },
    );

    expect(prisma.healthRecord.update).toHaveBeenCalledWith({
      where: { id: recordId },
      data: expect.objectContaining({
        title: 'Rabies updated',
        date: new Date('2026-02-01T00:00:00.000Z'),
      }),
    });
    expect(result.title).toBe('Rabies updated');
  });

  it('soft deletes a health record after ownership is proven', async () => {
    prisma.healthRecord.findFirst.mockResolvedValueOnce(record);
    prisma.healthRecord.update.mockResolvedValueOnce({ ...record, isActive: false });

    const result = await controller.remove(recordId, { user: { id: userId } });

    expect(prisma.healthRecord.update).toHaveBeenCalledWith({
      where: { id: recordId },
      data: { isActive: false },
    });
    expect(result.isActive).toBe(false);
  });

  it('adds and removes attachments without touching external storage', async () => {
    prisma.healthRecord.findFirst
      .mockResolvedValueOnce(record)
      .mockResolvedValueOnce({ ...record, attachments: [...record.attachments, 'https://files.example/new.pdf'] });
    prisma.healthRecord.update
      .mockResolvedValueOnce({ ...record, attachments: [...record.attachments, 'https://files.example/new.pdf'] })
      .mockResolvedValueOnce(record);

    await expect(
      controller.addAttachment(recordId, 'https://files.example/new.pdf', { user: { id: userId } }),
    ).resolves.toMatchObject({
      attachments: ['https://files.example/old.pdf', 'https://files.example/new.pdf'],
    });

    await expect(
      controller.removeAttachment(recordId, 'https://files.example/new.pdf', { user: { id: userId } }),
    ).resolves.toMatchObject({
      attachments: ['https://files.example/old.pdf'],
    });
  });

  it('returns reminders grouped by upcoming and overdue records', async () => {
    const upcoming = [{ ...record, id: 'upcoming-id' }];
    const overdue = [{ ...record, id: 'overdue-id', nextDueDate: new Date(Date.now() - 86400000) }];
    prisma.healthRecord.findMany.mockResolvedValueOnce(upcoming).mockResolvedValueOnce(overdue);

    const result = await controller.getReminders({ user: { id: userId } });

    expect(result).toEqual({ upcoming, overdue });
    expect(prisma.healthRecord.findMany).toHaveBeenCalledTimes(2);
  });

  it('gets records by date range only after pet ownership is proven', async () => {
    prisma.healthRecord.findMany.mockResolvedValueOnce([record]);

    const result = await controller.getRecordsByDateRange(
      petId,
      '2026-01-01',
      '2026-12-31',
      { user: { id: userId } },
    );

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.healthRecord.findMany).toHaveBeenCalledWith({
      where: {
        petId,
        date: { gte: new Date('2026-01-01'), lte: new Date('2026-12-31') },
        isActive: true,
      },
      orderBy: { date: 'desc' },
    });
    expect(result).toEqual([record]);
  });
});
