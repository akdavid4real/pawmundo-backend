import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';

describe('ConsultationsController', () => {
  let controller: ConsultationsController;
  let service: ConsultationsService;

  const mockConsultationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByStatus: jest.fn(),
    findById: jest.fn(),
    findByIdForVet: jest.fn(),
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
    sendMessage: jest.fn(),
    markMessagesAsRead: jest.fn(),
    isConsultationAssignedToVet: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'test-user-uuid',
      role: 'user',
    },
  };

  const mockVetRequest = {
    user: {
      id: 'test-vet-uuid',
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
        petId: 'pet-uuid-123',
        scheduledDate: new Date().toISOString(),
        reason: 'Checkup',
      };

      const mockConsultation = { id: 'consult-uuid', ...createDto };
      mockConsultationsService.create.mockResolvedValue(mockConsultation);

      const result = await controller.create(mockRequest, createDto as any);

      expect(service.create).toHaveBeenCalledWith(mockRequest.user.id, createDto);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('findAll', () => {
    it('should return all consultations for user', async () => {
      const mockConsultations = [{ id: 'consult-uuid' }];
      mockConsultationsService.findAll.mockResolvedValue(mockConsultations);

      const result = await controller.findAll(mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(mockRequest.user.id);
      expect(result).toEqual(mockConsultations);
    });

    it('should filter by status if provided', async () => {
      const status = 'pending';
      const mockConsultations = [{ id: 'consult-uuid', status }];
      mockConsultationsService.findByStatus.mockResolvedValue(mockConsultations);

      const result = await controller.findAll(mockRequest, status);

      expect(service.findByStatus).toHaveBeenCalledWith(mockRequest.user.id, status);
      expect(result).toEqual(mockConsultations);
    });
  });

  describe('getVetQueue', () => {
    it('should return queue for vet', async () => {
      const mockQueue = [{ id: 'consult-uuid', status: 'pending' }];
      mockConsultationsService.getVetQueue.mockResolvedValue(mockQueue);

      const result = await controller.getVetQueue(mockVetRequest);

      expect(service.getVetQueue).toHaveBeenCalledWith(mockVetRequest.user.id);
      expect(result).toEqual(mockQueue);
    });
  });

  describe('getVetActive', () => {
    it('should return active consultations for vet', async () => {
      const mockActive = [{ id: 'consult-uuid', status: 'assigned' }];
      mockConsultationsService.getVetActive.mockResolvedValue(mockActive);

      const result = await controller.getVetActive(mockVetRequest);

      expect(service.getVetActive).toHaveBeenCalledWith(mockVetRequest.user.id);
      expect(result).toEqual(mockActive);
    });
  });

  describe('getVetHistory', () => {
    it('should return history for vet', async () => {
      const mockHistory = [{ id: 'consult-uuid', status: 'completed' }];
      mockConsultationsService.getVetHistory.mockResolvedValue(mockHistory);

      const result = await controller.getVetHistory(mockVetRequest);

      expect(service.getVetHistory).toHaveBeenCalledWith(mockVetRequest.user.id);
      expect(result).toEqual(mockHistory);
    });
  });

  describe('acceptConsultation', () => {
    it('should accept consultation for vet', async () => {
      const consultationId = 'consult-uuid';
      const mockConsultation = { id: consultationId, status: 'assigned' };
      mockConsultationsService.acceptConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.acceptConsultation(consultationId, mockVetRequest);

      expect(service.acceptConsultation).toHaveBeenCalledWith(
        consultationId,
        mockVetRequest.user.id,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('releaseConsultation', () => {
    it('should release consultation for vet', async () => {
      const consultationId = 'consult-uuid';
      const mockConsultation = { id: consultationId, status: 'pending' };
      mockConsultationsService.releaseConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.releaseConsultation(consultationId, mockVetRequest);

      expect(service.releaseConsultation).toHaveBeenCalledWith(
        consultationId,
        mockVetRequest.user.id,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('cancel', () => {
    it('should cancel consultation', async () => {
      const consultationId = 'consult-uuid';
      const mockConsultation = { id: consultationId, status: 'cancelled' };
      mockConsultationsService.cancel.mockResolvedValue(mockConsultation);

      const result = await controller.cancel(consultationId, mockRequest);

      expect(service.cancel).toHaveBeenCalledWith(consultationId, mockRequest.user.id);
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('startConsultation', () => {
    it('should start consultation', async () => {
      const consultationId = 'consult-uuid';
      const meetingLink = 'https://meet.example.com/123';
      const mockConsultation = { id: consultationId, status: 'in-progress', meetingLink };
      mockConsultationsService.startConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.startConsultation(consultationId, mockRequest, meetingLink);

      expect(service.startConsultation).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.id,
        meetingLink,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('completeConsultation', () => {
    it('should complete consultation', async () => {
      const consultationId = 'consult-uuid';
      const notes = 'Patient is healthy';
      const prescription = 'Vitamin supplements';
      const payload = { notes, prescription };
      const mockConsultation = { id: consultationId, status: 'completed', notes, prescription };
      mockConsultationsService.completeConsultation.mockResolvedValue(mockConsultation);

      const result = await controller.completeConsultation(
        consultationId,
        mockRequest,
        payload,
      );

      expect(service.completeConsultation).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.id,
        payload,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const consultationId = 'consult-uuid';
      const mockConsultation = { id: consultationId, messages: [{ text: 'Hello' }] };
      mockConsultationsService.sendMessage.mockResolvedValue(mockConsultation);

      const result = await controller.sendMessage(consultationId, mockRequest, 'Hello');

      expect(service.sendMessage).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.id,
        'Hello',
        false,
      );
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read', async () => {
      const consultationId = 'consult-uuid';
      const mockConsultation = { id: consultationId, messages: [{ id: 'message-1', isRead: true }] };
      mockConsultationsService.markMessagesAsRead.mockResolvedValue(mockConsultation);

      const result = await controller.markMessagesAsRead(
        consultationId,
        mockRequest,
        ['message-1'],
      );

      expect(service.markMessagesAsRead).toHaveBeenCalledWith(
        consultationId,
        mockRequest.user.id,
        ['message-1'],
      );
      expect(result).toEqual(mockConsultation);
    });
  });
});
