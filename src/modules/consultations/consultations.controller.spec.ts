import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('ConsultationsController', () => {
  let controller: ConsultationsController;
  let service: ConsultationsService;

  const mockConsultationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByStatus: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
    startConsultation: jest.fn(),
    completeConsultation: jest.fn(),
    getUpcoming: jest.fn(),
    getVetQueue: jest.fn(),
    getVetActive: jest.fn(),
    getVetHistory: jest.fn(),
    acceptConsultation: jest.fn(),
    releaseConsultation: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: new Types.ObjectId().toString(),
      role: 'user',
    },
  };

  const mockVetRequest = {
    user: {
      userId: new Types.ObjectId().toString(),
      role: 'vet',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultationsController],
      providers: [
        {
          provide: ConsultationsService,
          useValue: mockConsultationsService,
        },
      ],
    }).compile();

    controller = module.get<ConsultationsController>(ConsultationsController);
    service = module.get<ConsultationsService>(ConsultationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a consultation', async () => {
      const createDto = {
        petId: new Types.ObjectId().toString(),
        scheduledDate: new Date().toISOString(),
        reason: 'Checkup',
      };

      const mockConsultation = { _id: new Types.ObjectId(), ...createDto };
      mockConsultationsService.create.mockResolvedValue(mockConsultation);

      const result = await controller.create(mockRequest, createDto);

      expect(service.create).toHaveBeenCalledWith(mockRequest.user.userId, createDto);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('findAll', () => {
    it('should return all consultations for user', async () => {
      const mockConsultations = [{ _id: new Types.ObjectId() }];
      mockConsultationsService.findAll.mockResolvedValue(mockConsultations);

      const result = await controller.findAll(mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user.userId);
      expect(result).toEqual(mockConsultations);
    });

    it('should filter by status if provided', async () => {
      const status = 'pending';
      const mockConsultations = [{ _id: new Types.ObjectId(), status }];
      mockConsultationsService.findByStatus.mockResolvedValue(mockConsultations);

      const result = await controller.findAll(mockRequest, status);

      expect(service.findByStatus).toHaveBeenCalledWith(mockRequest.user.userId, status);
      expect(result).toEqual(mockConsultations);
    });
  });

  describe('getVetQueue', () => {
    it('should return queue for vet', async () => {
      const mockQueue = [{ _id: new Types.ObjectId(), status: 'pending' }];
      mockConsultationsService.getVetQueue.mockResolvedValue(mockQueue);

      const result = await controller.getVetQueue();

      expect(service.getVetQueue).toHaveBeenCalled();
      expect(result).toEqual(mockQueue);
    });
  });

  describe('getVetActive', () => {
    it('should return active consultations for vet', async () => {
      const mockActive = [{ _id: new Types.ObjectId(), status: 'assigned' }];
      mockConsultationsService.getVetActive.mockResolvedValue(mockActive);

      const result = await controller.getVetActive(mockVetRequest);

      expect(service.getVetActive).toHaveBeenCalledWith(mockVetRequest.user.userId);
      expect(result).toEqual(mockActive);
    });
  });

  describe('getVetHistory', () => {
    it('should return history for vet', async () => {
      const mockHistory = [{ _id: new Types.ObjectId(), status: 'completed' }];
      mockConsultationsService.getVetHistory.mockResolvedValue(mockHistory);

      const result = await controller.getVetHistory(mockVetRequest);

      expect(service.getVetHistory).toHaveBeenCalledWith(mockVetRequest.user.userId);
      expect(result).toEqual(mockHistory);
    });
  });

  describe('acceptConsultation', () => {
    it('should accept consultation for vet', async () => {
      const consultationId = new Types.ObjectId().toString();
      const mockConsultation = { _id: consultationId, status: 'assigned' };
      mockConsultationsService.acceptConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.acceptConsultation(consultationId, mockVetRequest);

      expect(service.acceptConsultation).toHaveBeenCalledWith(
        consultationId,
        mockVetRequest.user.userId,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('releaseConsultation', () => {
    it('should release consultation for vet', async () => {
      const consultationId = new Types.ObjectId().toString();
      const mockConsultation = { _id: consultationId, status: 'pending' };
      mockConsultationsService.releaseConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.releaseConsultation(consultationId, mockVetRequest);

      expect(service.releaseConsultation).toHaveBeenCalledWith(
        consultationId,
        mockVetRequest.user.userId,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('cancel', () => {
    it('should cancel consultation', async () => {
      const consultationId = new Types.ObjectId().toString();
      const mockConsultation = { _id: consultationId, status: 'cancelled' };
      mockConsultationsService.cancel.mockResolvedValue(mockConsultation);

      const result = await controller.cancel(consultationId, mockRequest);

      expect(service.cancel).toHaveBeenCalledWith(consultationId, mockRequest.user.userId);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('startConsultation', () => {
    it('should start consultation', async () => {
      const consultationId = new Types.ObjectId().toString();
      const meetingLink = 'https://meet.example.com/123';
      const mockConsultation = { _id: consultationId, status: 'in-progress', meetingLink };
      mockConsultationsService.startConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.startConsultation(consultationId, mockRequest, meetingLink);

      expect(service.startConsultation).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.userId,
        meetingLink,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('completeConsultation', () => {
    it('should complete consultation', async () => {
      const consultationId = new Types.ObjectId().toString();
      const notes = 'Patient is healthy';
      const prescription = 'Vitamin supplements';
      const mockConsultation = { _id: consultationId, status: 'completed', notes, prescription };
      mockConsultationsService.completeConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.completeConsultation(
        consultationId,
        mockRequest,
        notes,
        prescription,
      );

      expect(service.completeConsultation).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.userId,
        notes,
        prescription,
      );
      expect(result).toEqual(mockConsultation);
    });
  });
});
