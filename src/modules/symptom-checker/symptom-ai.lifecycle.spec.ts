import { NotFoundException } from '@nestjs/common';
import { AiChatService } from '../ai-chat/ai-chat.service';
import { SymptomCheckerService } from './symptom-checker.service';

describe('AI and symptom lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';
  const originalFetch = global.fetch;
  const originalApiKey = process.env.MISTRAL_API_KEY;

  let prisma: any;
  let entitlementsService: any;
  let symptomService: SymptomCheckerService;
  let aiChatService: AiChatService;
  let petsService: any;
  let healthRecordsService: any;
  let appointmentsService: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          firstName: 'Jane',
          lastName: 'Owner',
          email: 'jane@example.com',
        }),
      },
      pet: {
        findUnique: jest.fn().mockResolvedValue({
          id: petId,
          ownerId: userId,
          name: 'Milo',
          species: 'cat',
          breed: 'Tabby',
          age: 3,
          gender: 'male',
          healthStatus: 'healthy',
        }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      healthRecord: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      medication: {
        findMany: jest.fn().mockResolvedValue([]),
      },
      symptomCheck: {
        create: jest.fn().mockResolvedValue({ id: 'symptom-check-id' }),
        findMany: jest.fn(),
      },
    };
    entitlementsService = {
      requireSymptomChecker: jest.fn().mockResolvedValue('plus'),
      requireAiChat: jest.fn().mockResolvedValue('plus'),
    };
    petsService = {
      findByOwner: jest.fn().mockResolvedValue([
        { id: petId, name: 'Milo', species: 'cat', breed: 'Tabby', age: 3, gender: 'male', healthStatus: 'healthy' },
      ]),
    };
    healthRecordsService = {
      getHealthSummary: jest.fn().mockResolvedValue({ totalRecords: 1, upcomingCount: 0, overdueCount: 0 }),
      findByPet: jest.fn().mockResolvedValue([
        { type: 'checkup', title: 'Annual exam', date: new Date('2026-01-01T00:00:00.000Z') },
      ]),
    };
    appointmentsService = {
      findUpcoming: jest.fn().mockResolvedValue([]),
    };

    symptomService = new SymptomCheckerService(prisma, entitlementsService);
    aiChatService = new AiChatService(
      prisma,
      symptomService,
      petsService,
      healthRecordsService,
      appointmentsService,
      entitlementsService,
    );
    process.env.MISTRAL_API_KEY = 'test-key';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.MISTRAL_API_KEY = originalApiKey;
    jest.resetAllMocks();
  });

  it('persists successful symptom analysis to mocked history after entitlement and ownership checks', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify({
                urgencyLevel: 'Monitor',
                possibleConditions: ['Minor irritation'],
                recommendations: ['Monitor closely'],
                vetRequired: false,
                warningSignsToWatch: ['Worsening symptoms'],
                personalizedMessage: 'Milo can be monitored for now.',
              }),
            },
          },
        ],
      }),
    });

    const result = await symptomService.checkSymptoms(userId, {
      petId,
      symptoms: ['sneezing'],
      duration: '1 day',
      severity: 1,
      additionalInfo: 'Eating normally',
    });

    expect(entitlementsService.requireSymptomChecker).toHaveBeenCalledWith(userId);
    expect(prisma.pet.findUnique).toHaveBeenCalledWith({ where: { id: petId } });
    expect(prisma.symptomCheck.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        petId,
        petName: 'Milo',
        urgencyLevel: 'Monitor',
        vetRequired: false,
      }),
    });
    expect(result.analysis.personalizedMessage).toBe('Milo can be monitored for now.');
  });

  it('blocks symptom persistence when the pet belongs to another user', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({
      id: petId,
      ownerId: 'other-user',
      name: 'Milo',
    });

    await expect(
      symptomService.checkSymptoms(userId, {
        petId,
        symptoms: ['sneezing'],
        duration: '1 day',
        severity: 1,
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prisma.symptomCheck.create).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns owner-scoped symptom history newest first', async () => {
    prisma.symptomCheck.findMany.mockResolvedValueOnce([{ id: 'latest-check' }]);

    await expect(symptomService.getHistory(userId)).resolves.toEqual([{ id: 'latest-check' }]);
    expect(prisma.symptomCheck.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  });

  it('sends AI chat with owned pet health context and returns provider content', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Milo should be monitored.' } }],
      }),
    });

    const result = await aiChatService.chat(userId, { message: 'How is Milo doing?' });
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);

    expect(entitlementsService.requireAiChat).toHaveBeenCalledWith(userId);
    expect(petsService.findByOwner).toHaveBeenCalledWith(userId);
    expect(healthRecordsService.getHealthSummary).toHaveBeenCalledWith(petId, userId);
    expect(body.messages[0].content).toContain('Milo');
    expect(result.response).toBe('Milo should be monitored.');
  });

  it('returns controlled AI chat fallback when the provider fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await aiChatService.chat(userId, { message: 'Help' });

    expect(result.response).toContain('connectivity issues');
    expect(result.typewriter).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
