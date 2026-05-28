import { Test, TestingModule } from '@nestjs/testing';
import { SymptomCheckerService } from './symptom-checker.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SymptomCheckerService', () => {
  let service: SymptomCheckerService;
  let mockFetch: jest.Mock;
  const originalApiKey = process.env.MISTRAL_API_KEY;

  const mockPrismaService = {
    user: { findUnique: jest.fn() },
    pet: { findUnique: jest.fn(), findMany: jest.fn() },
    healthRecord: { findMany: jest.fn() },
    medication: { findMany: jest.fn() },
    symptomCheck: { create: jest.fn(), findMany: jest.fn() },
  };

  const dto = {
    petId: 'pet-id',
    symptoms: ['Vomiting', 'Lethargy'],
    duration: 'Several days',
    severity: 3,
    additionalInfo: 'Not eating normally',
  };

  beforeEach(async () => {
    mockFetch = jest.fn();
    global.fetch = mockFetch as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SymptomCheckerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SymptomCheckerService>(SymptomCheckerService);
    mockPrismaService.user.findUnique.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    });
    mockPrismaService.pet.findUnique.mockResolvedValue({
      id: 'pet-id',
      ownerId: 'user-id',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Mixed',
      age: 4,
      gender: 'male',
      weight: 12,
      healthStatus: 'healthy',
    });
    mockPrismaService.healthRecord.findMany.mockResolvedValue([]);
    mockPrismaService.medication.findMany.mockResolvedValue([]);
    mockPrismaService.symptomCheck.create.mockResolvedValue({ id: 'check-id' });
  });

  afterEach(() => {
    process.env.MISTRAL_API_KEY = originalApiKey;
    jest.clearAllMocks();
  });

  it('returns a safety fallback with personalized message when Mistral is unavailable', async () => {
    delete process.env.MISTRAL_API_KEY;

    const result = await service.checkSymptoms('user-id', dto);

    expect(result.analysis.vetRequired).toBe(true);
    expect(result.analysis.urgencyLevel).toBe('Urgent');
    expect(result.analysis.personalizedMessage).toContain('conservative safety fallback');
    expect(mockPrismaService.symptomCheck.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        personalizedMessage: expect.stringContaining('conservative safety fallback'),
      }),
    }));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns a conservative fallback with personalized message when AI JSON is malformed', async () => {
    process.env.MISTRAL_API_KEY = 'test-key';
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'not-json' } }],
      }),
    });

    const result = await service.checkSymptoms('user-id', dto);

    expect(result.analysis.vetRequired).toBe(true);
    expect(result.analysis.personalizedMessage).toContain('could not fully parse');
    expect(mockPrismaService.symptomCheck.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        personalizedMessage: expect.stringContaining('could not fully parse'),
      }),
    }));
  });
});
