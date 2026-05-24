import { Test, TestingModule } from '@nestjs/testing';
import { ActivityTrackingController } from './activity-tracking.controller';
import { ActivityTrackingService } from './activity-tracking.service';
import { CreateActivityDto } from './dto/create-activity.dto';

describe('ActivityTrackingController', () => {
  let controller: ActivityTrackingController;
  let service: ActivityTrackingService;

  const mockActivityTrackingService = {
    create: jest.fn(),
    findByPet: jest.fn(),
    getDailyStats: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityTrackingController],
      providers: [
        { provide: ActivityTrackingService, useValue: mockActivityTrackingService },
      ],
    }).compile();

    controller = module.get<ActivityTrackingController>(ActivityTrackingController);
    service = module.get<ActivityTrackingService>(ActivityTrackingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should log a new pet activity', async () => {
      const createDto: CreateActivityDto = {
        petId: 'pet-uuid',
        type: 'walk',
        date: '2024-01-15T10:30:00Z',
        duration: 30,
        distance: 2.5,
      };

      const mockActivity = { id: 'activity-id', ...createDto, userId: 'user-uuid' };
      mockActivityTrackingService.create.mockResolvedValue(mockActivity);

      const result = await controller.create({ user: { id: 'user-uuid' } }, createDto);

      expect(mockActivityTrackingService.create).toHaveBeenCalledWith(createDto, 'user-uuid');
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findByPet', () => {
    it('should find all activities for a pet', async () => {
      const mockActivities = [{ id: 'activity-id', type: 'walk', petId: 'pet-uuid' }];
      mockActivityTrackingService.findByPet.mockResolvedValue(mockActivities);

      const result = await controller.findByPet('pet-uuid', { user: { id: 'user-uuid' } });

      expect(mockActivityTrackingService.findByPet).toHaveBeenCalledWith('pet-uuid', 'user-uuid', undefined);
      expect(result).toEqual(mockActivities);
    });

    it('should find all activities for a pet filtered by type', async () => {
      const mockActivities = [{ id: 'activity-id', type: 'feeding', petId: 'pet-uuid' }];
      mockActivityTrackingService.findByPet.mockResolvedValue(mockActivities);

      const result = await controller.findByPet('pet-uuid', { user: { id: 'user-uuid' } }, 'feeding');

      expect(mockActivityTrackingService.findByPet).toHaveBeenCalledWith('pet-uuid', 'user-uuid', 'feeding');
      expect(result).toEqual(mockActivities);
    });
  });

  describe('getDailyStats', () => {
    it('should get daily statistics for a pet', async () => {
      const mockStats = { totalWalks: 1, totalDistance: 2.5, totalFeedings: 0, totalFoodAmount: 0, totalWaterIntake: 0, activities: [] };
      mockActivityTrackingService.getDailyStats.mockResolvedValue(mockStats);

      const result = await controller.getDailyStats('pet-uuid', { user: { id: 'user-uuid' } }, '2024-01-15');

      expect(mockActivityTrackingService.getDailyStats).toHaveBeenCalledWith('pet-uuid', 'user-uuid', '2024-01-15');
      expect(result).toEqual(mockStats);
    });
  });

  describe('remove', () => {
    it('should delete an activity record', async () => {
      const mockDeleted = { id: 'activity-id', isActive: false };
      mockActivityTrackingService.delete.mockResolvedValue(mockDeleted);

      const result = await controller.remove('activity-id', { user: { id: 'user-uuid' } });

      expect(mockActivityTrackingService.delete).toHaveBeenCalledWith('activity-id', 'user-uuid');
      expect(result).toEqual(mockDeleted);
    });
  });
});
