import { ForbiddenException } from '@nestjs/common';
import { AiChatService } from '../ai-chat/ai-chat.service';
import { ConsultationsService } from '../consultations/consultations.service';
import { PetsService } from '../pets/pets.service';
import { SymptomCheckerService } from '../symptom-checker/symptom-checker.service';

describe('Entitlement request-facing enforcement', () => {
  const forbidden = () => new ForbiddenException('subscription required');

  let prisma: any;
  let storageService: any;
  let entitlementsService: any;
  let petsService: PetsService;
  let consultationsService: ConsultationsService;
  let aiChatService: AiChatService;
  let symptomCheckerService: SymptomCheckerService;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    prisma = {
      pet: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      petPhoto: {
        create: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      healthRecord: {
        findMany: jest.fn(),
      },
      medication: {
        findMany: jest.fn(),
      },
      symptomCheck: {
        create: jest.fn(),
      },
      consultation: {
        create: jest.fn(),
      },
    };

    storageService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    entitlementsService = {
      requireCanCreatePet: jest.fn().mockResolvedValue(undefined),
      requirePhotoGallery: jest.fn().mockResolvedValue(undefined),
      requireAiChat: jest.fn().mockResolvedValue(undefined),
      requireSymptomChecker: jest.fn().mockResolvedValue(undefined),
      requireConsultation: jest.fn().mockResolvedValue(undefined),
      recordFreeMonthlyUsage: jest.fn().mockResolvedValue(undefined),
    };

    petsService = new PetsService(prisma, storageService, entitlementsService);

    consultationsService = new ConsultationsService(
      prisma,
      petsService,
      {
        findApprovedClinicOrThrow: jest.fn(),
        requireVetClinicAccess: jest.fn(),
      } as any,
      entitlementsService,
    );

    aiChatService = new AiChatService(
      prisma,
      {} as any,
      petsService,
      {
        getHealthSummary: jest.fn(),
        findByPet: jest.fn(),
      } as any,
      {
        findUpcoming: jest.fn(),
      } as any,
      entitlementsService,
    );

    symptomCheckerService = new SymptomCheckerService(prisma, entitlementsService);

    originalFetch = global.fetch;
    global.fetch = jest.fn() as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('blocks pet creation before creating a pet when the active plan is over limit', async () => {
    entitlementsService.requireCanCreatePet.mockRejectedValueOnce(forbidden());

    await expect(
      petsService.create({
        ownerId: 'free-user-id',
        name: 'Milo',
        species: 'cat',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requireCanCreatePet).toHaveBeenCalledWith('free-user-id');
    expect(prisma.pet.create).not.toHaveBeenCalled();
  });

  it('blocks gallery uploads before storage or photo persistence when the tier lacks gallery access', async () => {
    prisma.pet.findUnique.mockResolvedValueOnce({
      id: 'pet-id',
      ownerId: 'free-user-id',
      isActive: true,
    });
    entitlementsService.requirePhotoGallery.mockRejectedValueOnce(forbidden());

    await expect(
      petsService.uploadPhoto(
        'pet-id',
        'free-user-id',
        Buffer.from('image'),
        'image/jpeg',
        'caption',
      ),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requirePhotoGallery).toHaveBeenCalledWith('free-user-id');
    expect(storageService.uploadFile).not.toHaveBeenCalled();
    expect(prisma.petPhoto.create).not.toHaveBeenCalled();
  });

  it('blocks AI chat before loading context or calling the AI provider for non-paid users', async () => {
    entitlementsService.requireAiChat.mockRejectedValueOnce(forbidden());

    await expect(
      aiChatService.chat('free-user-id', {
        message: 'Can you help with my dog?',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requireAiChat).toHaveBeenCalledWith('free-user-id');
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('blocks symptom checks before pet lookup, AI calls, or symptom history persistence for non-paid users', async () => {
    entitlementsService.requireSymptomChecker.mockRejectedValueOnce(forbidden());

    await expect(
      symptomCheckerService.checkSymptoms('free-user-id', {
        petId: 'pet-id',
        symptoms: ['coughing'],
        duration: '1 day',
        severity: 2,
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requireSymptomChecker).toHaveBeenCalledWith('free-user-id');
    expect(prisma.pet.findUnique).not.toHaveBeenCalled();
    expect(prisma.symptomCheck.create).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('blocks consultations before pet validation or consultation persistence when the user lacks the required tier', async () => {
    entitlementsService.requireConsultation.mockRejectedValueOnce(forbidden());

    await expect(
      consultationsService.create('free-user-id', {
        petId: 'pet-id',
        reason: 'Annual checkup',
        scheduledDate: '2026-06-01T10:00:00.000Z',
        consultationType: 'chat',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requireConsultation).toHaveBeenCalledWith('free-user-id', 'chat');
    expect(prisma.pet.findUnique).not.toHaveBeenCalled();
    expect(prisma.consultation.create).not.toHaveBeenCalled();
  });

  it('passes video consultation type into entitlement checks so Pro-only rules can be enforced', async () => {
    entitlementsService.requireConsultation.mockRejectedValueOnce(
      new ForbiddenException('Video consultations requires an active Pro subscription.'),
    );

    await expect(
      consultationsService.create('plus-user-id', {
        petId: 'pet-id',
        reason: 'Video consult',
        scheduledDate: '2026-06-01T10:00:00.000Z',
        consultationType: 'video',
      }),
    ).rejects.toThrow(ForbiddenException);

    expect(entitlementsService.requireConsultation).toHaveBeenCalledWith('plus-user-id', 'video');
    expect(prisma.consultation.create).not.toHaveBeenCalled();
  });
});
