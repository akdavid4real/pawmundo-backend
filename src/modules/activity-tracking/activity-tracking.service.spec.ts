// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ActivityTrackingService } from './activity-tracking.service';
import { Activity } from './schemas/activity.schema';

describe('ActivityTrackingService', () => {
  let service: ActivityTrackingService;
  let mockActivityModel: any;

  beforeEach(async () => {
    mockActivityModel = jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...dto, _id: 'activity123' }),
    }));
    
    mockActivityModel.find = jest.fn();
    mockActivityModel.findById = jest.fn();
    mockActivityModel.findByIdAndUpdate = jest.fn();
    mockActivityModel.save = jest.fn();
    mockActivityModel.sort = jest.fn();
    mockActivityModel.exec = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityTrackingService,
        {
          provide: getModelToken(Activity.name),
          useValue: mockActivityModel,
        },
      ],
    }).compile();

    service = module.get<ActivityTrackingService>(ActivityTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create activity', async () => {
    const createActivityDto = {
      petId: 'pet123',
      type: 'walk',
      date: '2024-01-15T10:00:00Z',
      duration: 30,
      distance: 2.5,
    };

    const result = await service.create(createActivityDto, 'user123');
    expect(mockActivityModel).toHaveBeenCalled();
  });

  it('should find activities by pet', async () => {
    const mockActivities = [{ petId: 'pet123', type: 'walk' }];
    mockActivityModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockActivities),
      }),
    });

    const result = await service.findByPet('pet123');
    expect(mockActivityModel.find).toHaveBeenCalledWith({ petId: 'pet123', isActive: true });
  });
});