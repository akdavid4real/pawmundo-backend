import { Test, TestingModule } from '@nestjs/testing';
import { AiChatService } from './ai-chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';
import { PetsService } from '../pets/pets.service';
import { HealthRecordsService } from '../health-records/health-records.service';
import { AppointmentsService } from '../appointments/appointments.service';

describe('AiChatService', () => {
  let service: AiChatService;
  let prismaService: PrismaService;
  let petsService: PetsService;
  let appointmentsService: AppointmentsService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    pet: {
      findMany: jest.fn(),
    },
  };

  const mockSymptomCheckerService = {};

  const mockPetsService = {
    findByOwner: jest.fn(),
  };

  const mockHealthRecordsService = {};

  const mockAppointmentsService = {
    findUpcoming: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiChatService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SymptomCheckerService, useValue: mockSymptomCheckerService },
        { provide: PetsService, useValue: mockPetsService },
        { provide: HealthRecordsService, useValue: mockHealthRecordsService },
        { provide: AppointmentsService, useValue: mockAppointmentsService },
      ],
    }).compile();

    service = module.get<AiChatService>(AiChatService);
    prismaService = module.get<PrismaService>(PrismaService);
    petsService = module.get<PetsService>(PetsService);
    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTypingIndicator', () => {
    it('should return typing info', async () => {
      const result = await service.getTypingIndicator();
      expect(result.isTyping).toBe(true);
      expect(result.message).toBe('Typing...');
      expect(result).toHaveProperty('timestamp');
    });
  });

  describe('chat fallback', () => {
    it('should generate a fallback response when api fails', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ firstName: 'John' });
      mockPetsService.findByOwner.mockResolvedValue([]);
      mockAppointmentsService.findUpcoming.mockResolvedValue([]);

      const mockDto = { message: 'hello', context: 'greeting' };
      const response = await service.chat('user-id', mockDto);
      expect(response).toHaveProperty('response');
      expect(typeof response.response).toBe('string');
      expect(response.typewriter).toBe(true);
      // fallback response doesn't have suggestedActions
    });
  });

  describe('getOfflineResponse', () => {
    it('should generate an offline response using user and pets info', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ firstName: 'John' });
      mockPrismaService.pet.findMany.mockResolvedValue([{ name: 'Buddy', species: 'Dog' }]);

      const response = await service.getOfflineResponse('user-id', 'test message');

      expect(response).toHaveProperty('response');
    });

    it('should handle case when user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.pet.findMany.mockResolvedValue([]);

      const response = await service.getOfflineResponse('user-id', 'test message');

      expect(response).toHaveProperty('response');
    });
  });
});
