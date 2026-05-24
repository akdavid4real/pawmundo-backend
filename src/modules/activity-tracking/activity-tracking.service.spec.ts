import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTrackingService } from './activity-tracking.service';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';

describe('ActivityTrackingService', () => {
  let service: ActivityTrackingService;
  let prisma: PrismaService;

  const mockPrismaService = {
    activity: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPetsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityTrackingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PetsService, useValue: mockPetsService },
      ],
    }).compile();

    service = module.get<ActivityTrackingService>(ActivityTrackingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create activity', async () => {
    const createActivityDto = {
      petId: 'pet-uuid-123',
      type: 'walk',
      date: '2024-01-15T10:00:00Z',
      duration: 30,
      distance: 2.5,
    };

    const mockActivity = { id: 'activity-uuid-123', ...createActivityDto, userId: 'user-uuid-123' };
    mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });
    mockPrismaService.activity.create.mockResolvedValue(mockActivity);

    const result = await service.create(createActivityDto as any, 'user-uuid-123');

    expect(mockPrismaService.activity.create).toHaveBeenCalledWith({
      data: {
        ...createActivityDto,
        type: 'walk',
        date: new Date(createActivityDto.date)
      }
    });
    expect(result).toEqual(mockActivity);
  });

  it('should find activities by pet', async () => {
    const mockActivities = [{ petId: 'pet-uuid-123', type: 'walk' }];
    mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });
    mockPrismaService.activity.findMany.mockResolvedValue(mockActivities);

    const result = await service.findByPet('pet-uuid-123', 'user-uuid-123');

    expect(mockPrismaService.activity.findMany).toHaveBeenCalledWith({
      where: { petId: 'pet-uuid-123', isActive: true },
      orderBy: { date: 'desc' },
    });
    expect(result).toEqual(mockActivities);
  });
});
