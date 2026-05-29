import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { ConsultationStatus } from '@prisma/client';
import { ConsultationsService } from './consultations.service';

describe('Consultations lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const vetId = 'vet-id';
  const otherVetId = 'other-vet-id';
  const consultationId = 'consultation-id';
  const petId = 'pet-id';

  const pendingConsultation = {
    id: consultationId,
    userId,
    petId,
    clinicId: null,
    assignedVetId: null,
    status: ConsultationStatus.pending,
    isActive: true,
    messages: [],
  };

  let prisma: any;
  let petsService: any;
  let clinicsService: any;
  let entitlementsService: any;
  let service: ConsultationsService;

  beforeEach(() => {
    prisma = {
      consultation: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      consultationMessage: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
      consultationNote: {
        create: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue({ id: petId, ownerId: userId, isActive: true }),
    };
    clinicsService = {
      findApprovedClinicOrThrow: jest.fn().mockResolvedValue({ id: 'clinic-id' }),
      getActiveClinicIdsForUser: jest.fn().mockResolvedValue([]),
      requireVetClinicAccess: jest.fn().mockResolvedValue(undefined),
    };
    entitlementsService = {
      requireConsultation: jest.fn().mockResolvedValue(undefined),
    };

    service = new ConsultationsService(prisma, petsService, clinicsService, entitlementsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a pending consultation after entitlement, pet, and optional clinic checks', async () => {
    const dto = {
      petId,
      clinicId: 'clinic-id',
      reason: 'Annual checkup',
      symptoms: 'Sneezing',
      consultationType: 'chat',
      scheduledDate: '2026-06-01T10:00:00.000Z',
    };
    prisma.consultation.create.mockResolvedValueOnce({ ...pendingConsultation, ...dto });

    const result = await service.create(userId, dto as any);

    expect(entitlementsService.requireConsultation).toHaveBeenCalledWith(userId, 'chat');
    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(clinicsService.findApprovedClinicOrThrow).toHaveBeenCalledWith('clinic-id');
    expect(prisma.consultation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        petId,
        clinicId: 'clinic-id',
        status: ConsultationStatus.pending,
        scheduledDate: new Date(dto.scheduledDate),
      }),
    });
    expect(result.userId).toBe(userId);
  });

  it('does not validate pet or write consultation when entitlement rejects the request', async () => {
    entitlementsService.requireConsultation.mockRejectedValueOnce(new ForbiddenException('paid required'));

    await expect(
      service.create(userId, {
        petId,
        reason: 'Annual checkup',
        consultationType: 'chat',
        scheduledDate: '2026-06-01T10:00:00.000Z',
      } as any),
    ).rejects.toThrow(ForbiddenException);

    expect(petsService.findById).not.toHaveBeenCalled();
    expect(prisma.consultation.create).not.toHaveBeenCalled();
  });

  it('lists active owner consultations and maps incoming status aliases', async () => {
    prisma.consultation.findMany.mockResolvedValueOnce([pendingConsultation]);

    await expect(service.findByStatus(userId, 'incoming')).resolves.toEqual([pendingConsultation]);

    expect(prisma.consultation.findMany).toHaveBeenCalledWith({
      where: { userId, status: ConsultationStatus.pending, isActive: true },
      include: { pet: { select: { name: true, species: true } } },
      orderBy: { scheduledDate: 'desc' },
    });
  });

  it('updates partial consultation fields and normalizes status/payment aliases', async () => {
    prisma.consultation.findUnique.mockResolvedValueOnce(pendingConsultation);
    prisma.consultation.update.mockResolvedValueOnce({
      ...pendingConsultation,
      status: ConsultationStatus.in_progress,
      paymentStatus: 'pending_payment',
    });

    const result = await service.update(consultationId, userId, {
      status: 'in-progress',
      paymentStatus: 'pending',
      followUpDate: '2026-06-02T10:00:00.000Z',
    } as any);

    expect(prisma.consultation.update).toHaveBeenCalledWith({
      where: { id: consultationId },
      data: expect.objectContaining({
        status: ConsultationStatus.in_progress,
        paymentStatus: 'pending_payment',
        followUpDate: new Date('2026-06-02T10:00:00.000Z'),
      }),
    });
    expect(result.status).toBe(ConsultationStatus.in_progress);
  });

  it('cancels by patching status to cancelled through the owner update path', async () => {
    prisma.consultation.findUnique.mockResolvedValueOnce(pendingConsultation);
    prisma.consultation.update.mockResolvedValueOnce({
      ...pendingConsultation,
      status: ConsultationStatus.cancelled,
    });

    await expect(service.cancel(consultationId, userId)).resolves.toMatchObject({
      status: ConsultationStatus.cancelled,
    });

    expect(prisma.consultation.update).toHaveBeenCalledWith({
      where: { id: consultationId },
      data: { status: ConsultationStatus.cancelled },
    });
  });

  it('accepts a pending consultation for an authorized vet and reloads the assigned record', async () => {
    prisma.consultation.findFirst.mockResolvedValueOnce(pendingConsultation);
    prisma.consultation.update.mockResolvedValueOnce({
      ...pendingConsultation,
      assignedVetId: vetId,
      status: ConsultationStatus.assigned,
    });
    prisma.consultation.findUnique.mockResolvedValueOnce({
      ...pendingConsultation,
      assignedVetId: vetId,
      status: ConsultationStatus.assigned,
    });

    const result = await service.acceptConsultation(consultationId, vetId);

    expect(clinicsService.requireVetClinicAccess).toHaveBeenCalledWith(vetId, null);
    expect(prisma.consultation.update).toHaveBeenCalledWith({
      where: { id: consultationId },
      data: { assignedVetId: vetId, status: ConsultationStatus.assigned },
    });
    expect(result.assignedVetId).toBe(vetId);
  });

  it('rejects vet acceptance when the consultation is no longer pending', async () => {
    prisma.consultation.findFirst.mockResolvedValueOnce({
      ...pendingConsultation,
      status: ConsultationStatus.assigned,
      assignedVetId: otherVetId,
    });

    await expect(service.acceptConsultation(consultationId, vetId)).rejects.toThrow(ConflictException);
    expect(prisma.consultation.update).not.toHaveBeenCalled();
  });

  it('sends owner and vet messages only while consultation is open', async () => {
    const assignedConsultation = {
      ...pendingConsultation,
      status: ConsultationStatus.assigned,
      assignedVetId: vetId,
      messages: [{ id: 'message-1', text: 'hello', senderRole: 'user', isRead: false }],
      pet: { name: 'Milo', species: 'cat' },
    };
    prisma.consultation.findFirst.mockResolvedValueOnce(assignedConsultation);
    prisma.consultationMessage.create.mockResolvedValueOnce({
      id: 'message-2',
      text: 'How can I help?',
      senderId: vetId,
      senderRole: 'doctor',
      isRead: false,
    });
    prisma.consultation.update.mockResolvedValueOnce({});

    const result = await service.sendMessage(consultationId, vetId, 'How can I help?', true);

    expect(clinicsService.requireVetClinicAccess).toHaveBeenCalledWith(vetId, null);
    expect(prisma.consultationMessage.create).toHaveBeenCalledWith({
      data: {
        consultationId,
        text: 'How can I help?',
        senderId: vetId,
        senderRole: 'doctor',
        isRead: false,
      },
    });
    expect(result.messages).toHaveLength(2);
  });

  it('blocks messages after consultation completion', async () => {
    prisma.consultation.findFirst.mockResolvedValueOnce({
      ...pendingConsultation,
      status: ConsultationStatus.completed,
    });

    await expect(service.sendMessage(consultationId, userId, 'hello')).rejects.toThrow(BadRequestException);
    expect(prisma.consultationMessage.create).not.toHaveBeenCalled();
  });

  it('completes a consultation with clinical notes and records a vet note for assigned vets', async () => {
    prisma.consultation.findFirst.mockResolvedValueOnce({
      ...pendingConsultation,
      assignedVetId: vetId,
      status: ConsultationStatus.in_progress,
    });
    prisma.consultation.update.mockResolvedValueOnce({
      ...pendingConsultation,
      status: ConsultationStatus.completed,
      notes: 'Improving',
    });
    prisma.consultationNote.create.mockResolvedValueOnce({ id: 'note-id' });

    const result = await service.completeConsultation(consultationId, vetId, {
      diagnosis: 'Mild allergy',
      notes: 'Improving',
      prescription: 'Antihistamine',
      followUpRequired: true,
      followUpDate: '2026-06-05T10:00:00.000Z',
    });

    expect(prisma.consultation.update).toHaveBeenCalledWith({
      where: { id: consultationId },
      data: expect.objectContaining({
        status: ConsultationStatus.completed,
        notes: 'Improving',
        prescription: 'Antihistamine',
        followUpRequired: true,
        followUpDate: new Date('2026-06-05T10:00:00.000Z'),
      }),
    });
    expect(prisma.consultationNote.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        consultationId,
        vetId,
        noteType: 'diagnosis',
        isPrivate: false,
      }),
    });
    expect(result.status).toBe(ConsultationStatus.completed);
  });

  it('marks unread messages for the authorized participant only', async () => {
    prisma.consultation.findUnique.mockResolvedValueOnce({
      ...pendingConsultation,
      assignedVetId: vetId,
      messages: [
        { id: 'message-1', senderRole: 'user', isRead: false },
        { id: 'message-2', senderRole: 'doctor', isRead: false },
      ],
    });
    prisma.consultationMessage.updateMany.mockResolvedValueOnce({ count: 1 });
    prisma.consultation.update.mockResolvedValueOnce({});
    prisma.consultation.findUnique.mockResolvedValueOnce({
      ...pendingConsultation,
      messages: [{ id: 'message-1', isRead: true }],
    });

    const result = await service.markMessagesAsRead(consultationId, vetId);

    expect(prisma.consultationMessage.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['message-1'] } },
      data: { isRead: true },
    });
    expect(prisma.consultation.update).toHaveBeenCalledWith({
      where: { id: consultationId },
      data: { unreadCount: 0 },
    });
    expect(result.messages).toEqual([{ id: 'message-1', isRead: true }]);
  });
});
