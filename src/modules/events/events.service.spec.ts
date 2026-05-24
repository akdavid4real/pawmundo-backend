import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { ForbiddenException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;

  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPetsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PetsService, useValue: mockPetsService },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should validate pet ownership and map public category values during create', async () => {
    const dto = {
      petId: 'pet-uuid-123',
      title: 'Vet visit',
      description: 'Annual checkup',
      eventDate: '2026-01-15T09:00:00.000Z',
      category: 'appointment',
      notes: 'Bring records',
    };

    mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });
    mockPrismaService.event.create.mockResolvedValue({ id: 'event-uuid-123' });

    await service.create('user-uuid-123', dto as any);

    expect(mockPetsService.findById).toHaveBeenCalledWith('pet-uuid-123', 'user-uuid-123');
    expect(mockPrismaService.event.create).toHaveBeenCalledWith({
      data: {
        title: 'Vet visit',
        description: 'Annual checkup',
        eventDate: new Date('2026-01-15T09:00:00.000Z'),
        eventTime: undefined,
        category: 'event_appointment',
        location: undefined,
        notes: 'Bring records',
        isRecurring: undefined,
        recurringType: undefined,
        userId: 'user-uuid-123',
        petId: 'pet-uuid-123',
      },
    });
  });

  it('should reject creation when the user does not own the pet', async () => {
    mockPetsService.findById.mockRejectedValue(new ForbiddenException('Access denied'));

    await expect(
      service.create('user-uuid-123', {
        petId: 'foreign-pet-uuid',
        title: 'Vet visit',
        description: 'Annual checkup',
        eventDate: '2026-01-15T09:00:00.000Z',
        category: 'appointment',
      } as any),
    ).rejects.toThrow(ForbiddenException);

    expect(mockPrismaService.event.create).not.toHaveBeenCalled();
  });

  it('should validate a replacement petId and map category/status during update', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue({ id: 'event-uuid-123', userId: 'user-uuid-123' } as any);
    mockPetsService.findById.mockResolvedValue({ id: 'new-pet-uuid', ownerId: 'user-uuid-123' });
    mockPrismaService.event.update.mockResolvedValue({ id: 'event-uuid-123' });

    await service.update('event-uuid-123', 'user-uuid-123', {
      petId: 'new-pet-uuid',
      category: 'medication',
      status: 'completed',
      eventDate: '2026-01-16T11:30:00.000Z',
    } as any);

    expect(mockPetsService.findById).toHaveBeenCalledWith('new-pet-uuid', 'user-uuid-123');
    expect(mockPrismaService.event.update).toHaveBeenCalledWith({
      where: { id: 'event-uuid-123' },
      data: {
        eventDate: new Date('2026-01-16T11:30:00.000Z'),
        category: 'event_medication',
        status: 'event_completed',
        petId: 'new-pet-uuid',
      },
      include: { pet: { select: { name: true, breed: true } } },
    });
  });

  it('should map category filters to prisma enum values', async () => {
    mockPrismaService.event.findMany.mockResolvedValue([{ id: 'event-uuid-123' }]);

    await service.findByCategory('user-uuid-123', 'other');

    expect(mockPrismaService.event.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-uuid-123', category: 'event_other', isActive: true },
      include: { pet: { select: { name: true, breed: true } } },
      orderBy: { eventDate: 'asc' },
    });
  });
});
