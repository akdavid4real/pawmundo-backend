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
  let mockFetch: jest.Mock;

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
    mockFetch = jest.fn();
    global.fetch = mockFetch as any;

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
      mockFetch.mockResolvedValue({ ok: false, status: 401 });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      const mockDto = { message: 'hello', context: 'greeting' };
      const response = await service.chat('user-id', mockDto);
      expect(response).toHaveProperty('response');
      expect(typeof response.response).toBe('string');
      expect(response.typewriter).toBe(true);
      expect(consoleErrorSpy).toHaveBeenCalled();
      // fallback response doesn't have suggestedActions
    });
  });

  describe('chat vision payload', () => {
    it('should send image content to Mistral when an image is provided', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ firstName: 'John' });
      mockPetsService.findByOwner.mockResolvedValue([]);
      mockAppointmentsService.findUpcoming.mockResolvedValue([]);
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'The image shows a pet skin concern.' } }],
        }),
      });

      const response = await service.chat('user-id', {
        message: 'What do you see?',
        context: { source: 'mobile' },
        image: { base64: 'abc123', mimeType: 'image/jpeg' },
      });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody.model).toBe('mistral-small-latest');
      expect(requestBody.messages[0].content).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'text' }),
        {
          type: 'image_url',
          image_url: 'data:image/jpeg;base64,abc123',
        },
      ]));
      expect(response.response).toBe('The image shows a pet skin concern.');
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
