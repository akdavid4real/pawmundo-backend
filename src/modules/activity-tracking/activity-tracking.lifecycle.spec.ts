import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ActivityTrackingController } from './activity-tracking.controller';
import { ActivityTrackingService } from './activity-tracking.service';

describe('Activity tracking lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';
  const activityId = 'activity-id';

  const activity = {
    id: activityId,
    petId,
    type: 'walk',
    date: new Date('2026-01-01T10:00:00.000Z'),
    duration: 30,
    distance: 2.5,
    isActive: true,
    pet: { ownerId: userId },
  };

  let prisma: any;
  let petsService: any;
  let service: ActivityTrackingService;
  let controller: ActivityTrackingController;

  beforeEach(() => {
    prisma = {
      activity: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue({ id: petId, ownerId: userId, isActive: true }),
    };

    service = new ActivityTrackingService(prisma, petsService);
    controller = new ActivityTrackingController(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates an activity after proving pet ownership and converting date/type', async () => {
    prisma.activity.create.mockResolvedValueOnce({ ...activity, type: 'activity_other' });

    const result = await controller.create(
      { user: { id: userId } },
      {
        petId,
        type: 'other',
        date: '2026-01-01T10:00:00.000Z',
        notes: 'Custom activity',
      },
    );

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.activity.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        petId,
        type: 'activity_other',
        date: new Date('2026-01-01T10:00:00.000Z'),
      }),
    });
    expect(result.type).toBe('activity_other');
  });

  it('lists active activities for an owned pet with optional type filter', async () => {
    prisma.activity.findMany.mockResolvedValueOnce([activity]);

    const result = await controller.findByPet(petId, { user: { id: userId } }, 'walk');

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: { petId, isActive: true, type: 'walk' },
      orderBy: { date: 'desc' },
    });
    expect(result).toEqual([activity]);
  });

  it('denies reading an activity owned by another user', async () => {
    prisma.activity.findUnique.mockResolvedValueOnce({
      ...activity,
      pet: { ownerId: 'other-user' },
    });

    await expect(service.findById(activityId, userId)).rejects.toThrow(ForbiddenException);
  });

  it('soft deletes an activity after ownership is proven', async () => {
    prisma.activity.findUnique.mockResolvedValueOnce(activity);
    prisma.activity.update.mockResolvedValueOnce({ ...activity, isActive: false });

    const result = await controller.remove(activityId, { user: { id: userId } });

    expect(prisma.activity.update).toHaveBeenCalledWith({
      where: { id: activityId },
      data: { isActive: false },
    });
    expect(result.isActive).toBe(false);
  });

  it('returns not found for missing activity before delete side effects', async () => {
    prisma.activity.findUnique.mockResolvedValueOnce(null);

    await expect(controller.remove(activityId, { user: { id: userId } })).rejects.toThrow(NotFoundException);
    expect(prisma.activity.update).not.toHaveBeenCalled();
  });

  it('calculates daily walk, feeding, and water stats for an owned pet', async () => {
    const activities = [
      { ...activity, type: 'walk', distance: 2.5 },
      { ...activity, id: 'walk-2', type: 'walk', distance: 1.5 },
      { ...activity, id: 'feeding-1', type: 'feeding', foodAmount: 120 },
      { ...activity, id: 'water-1', type: 'water', waterAmount: 300 },
    ];
    prisma.activity.findMany.mockResolvedValueOnce(activities);

    const result = await controller.getDailyStats(petId, { user: { id: userId } }, '2026-01-01');

    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: {
        petId,
        date: {
          gte: expect.any(Date),
          lte: expect.any(Date),
        },
        isActive: true,
      },
    });
    expect(result).toMatchObject({
      totalWalks: 2,
      totalDistance: 4,
      totalFeedings: 1,
      totalFoodAmount: 120,
      totalWaterIntake: 300,
    });
  });
});
