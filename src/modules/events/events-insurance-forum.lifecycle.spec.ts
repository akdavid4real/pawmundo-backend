import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EventStatus, InsuranceStatus } from '@prisma/client';
import { EventsService } from './events.service';
import { InsuranceService } from '../insurance/insurance.service';
import { ForumService } from '../forum/forum.service';

describe('Events, insurance, and forum lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const otherUserId = 'other-user-id';
  const petId = 'pet-id';
  const eventId = 'event-id';
  const insuranceId = 'insurance-id';
  const postId = 'post-id';

  let prisma: any;
  let petsService: any;
  let eventsService: EventsService;
  let insuranceService: InsuranceService;
  let forumService: ForumService;

  beforeEach(() => {
    prisma = {
      event: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      insurance: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      insuranceClaim: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      forumPost: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      forumLike: {
        create: jest.fn(),
        delete: jest.fn(),
      },
      forumReply: {
        create: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue({ id: petId, ownerId: userId, isActive: true }),
    };

    eventsService = new EventsService(prisma, petsService);
    insuranceService = new InsuranceService(prisma, petsService);
    forumService = new ForumService(prisma);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates, updates, lists by category, and soft deletes user events through mocked persistence', async () => {
    prisma.event.create.mockResolvedValueOnce({ id: eventId, userId, petId, category: 'event_medical' });
    prisma.event.findFirst
      .mockResolvedValueOnce({ id: eventId, userId, isActive: true })
      .mockResolvedValueOnce({ id: eventId, userId, isActive: true });
    prisma.event.update
      .mockResolvedValueOnce({ id: eventId, status: EventStatus.event_completed })
      .mockResolvedValueOnce({ id: eventId, isActive: false });
    prisma.event.findMany.mockResolvedValueOnce([{ id: eventId, category: 'event_medical' }]);

    await expect(
      eventsService.create(userId, {
        title: 'Vet visit',
        eventDate: '2026-06-01T10:00:00.000Z',
        category: 'medical',
        petId,
      } as any),
    ).resolves.toMatchObject({ category: 'event_medical' });
    await expect(
      eventsService.update(eventId, userId, {
        status: 'completed',
        eventDate: '2026-06-02T10:00:00.000Z',
      } as any),
    ).resolves.toMatchObject({ status: EventStatus.event_completed });
    await expect(eventsService.findByCategory(userId, 'medical')).resolves.toEqual([
      { id: eventId, category: 'event_medical' },
    ]);
    await expect(eventsService.delete(eventId, userId)).resolves.toBeUndefined();

    expect(prisma.event.update).toHaveBeenLastCalledWith({
      where: { id: eventId },
      data: { isActive: false },
    });
  });

  it('rejects event detail when the event is missing or inactive for the user', async () => {
    prisma.event.findFirst.mockResolvedValueOnce(null);

    await expect(eventsService.findById(eventId, userId)).rejects.toThrow(NotFoundException);
  });

  it('creates insurance only for owned pets and validates policy date range', async () => {
    prisma.insurance.create.mockResolvedValueOnce({
      id: insuranceId,
      userId,
      petId,
      status: InsuranceStatus.insurance_active,
    });

    await expect(
      insuranceService.create(userId, {
        petId,
        provider: 'PawCover',
        policyNumber: 'POL-123',
        coverageType: 'accident',
        premium: 50,
        deductible: 10,
        coverageLimit: 1000,
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2027-01-01T00:00:00.000Z',
      } as any),
    ).resolves.toMatchObject({ id: insuranceId });

    await expect(
      insuranceService.create(userId, {
        petId,
        provider: 'PawCover',
        policyNumber: 'POL-123',
        coverageType: 'accident',
        premium: 50,
        deductible: 10,
        coverageLimit: 1000,
        startDate: '2027-01-01T00:00:00.000Z',
        endDate: '2026-01-01T00:00:00.000Z',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('updates insurance status, checks coverage, submits claims, and soft deletes policies', async () => {
    const activePolicy = {
      id: insuranceId,
      userId,
      petId,
      status: InsuranceStatus.insurance_active,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      coverageLimit: 1000,
      deductible: 100,
    };
    prisma.insurance.findUnique
      .mockResolvedValueOnce(activePolicy)
      .mockResolvedValueOnce(activePolicy)
      .mockResolvedValueOnce(activePolicy)
      .mockResolvedValueOnce(activePolicy);
    prisma.insurance.update
      .mockResolvedValueOnce({ ...activePolicy, status: InsuranceStatus.insurance_cancelled })
      .mockResolvedValueOnce({ ...activePolicy, isActive: false });
    prisma.insuranceClaim.create.mockResolvedValueOnce({ id: 'claim-id', insuranceId, userId });

    await expect(insuranceService.updateStatus(insuranceId, userId, 'cancelled')).resolves.toMatchObject({
      status: InsuranceStatus.insurance_cancelled,
    });
    await expect(insuranceService.checkCoverage(insuranceId, userId, 500)).resolves.toMatchObject({
      covered: true,
      coverageAmount: 400,
      deductible: 100,
    });
    await expect(
      insuranceService.submitClaim(userId, {
        insuranceId,
        claimAmount: 500,
        serviceDate: '2026-06-01T00:00:00.000Z',
        description: 'Emergency care',
      } as any),
    ).resolves.toMatchObject({ id: 'claim-id' });
    await expect(insuranceService.delete(insuranceId, userId)).resolves.toMatchObject({ isActive: false });
  });

  it('denies access to another user insurance policy and claim', async () => {
    prisma.insurance.findUnique.mockResolvedValueOnce({ id: insuranceId, userId: otherUserId });
    prisma.insuranceClaim.findUnique.mockResolvedValueOnce({ id: 'claim-id', userId: otherUserId });

    await expect(insuranceService.findById(insuranceId, userId)).rejects.toThrow(ForbiddenException);
    await expect(insuranceService.getClaimById('claim-id', userId)).rejects.toThrow(ForbiddenException);
  });

  it('creates, lists, replies, likes, edits, and deletes forum posts through mocked persistence', async () => {
    prisma.forumPost.create.mockResolvedValueOnce({ id: postId, authorId: userId, title: 'Help' });
    prisma.forumPost.findMany.mockResolvedValueOnce([{ id: postId }]);
    prisma.forumPost.count.mockResolvedValueOnce(1);
    prisma.forumPost.findUnique
      .mockResolvedValueOnce({ id: postId, likes: [] })
      .mockResolvedValueOnce({ id: postId, likes: [{ id: 'like-id', userId }] })
      .mockResolvedValueOnce({ id: postId })
      .mockResolvedValueOnce({ id: postId, replies: [{ id: 'reply-id' }], likes: [] })
      .mockResolvedValueOnce({ id: postId, authorId: userId })
      .mockResolvedValueOnce({ id: postId, authorId: userId });
    prisma.forumLike.create.mockResolvedValueOnce({ id: 'like-id' });
    prisma.forumReply.create.mockResolvedValueOnce({ id: 'reply-id' });
    prisma.forumPost.update
      .mockResolvedValueOnce({ id: postId, title: 'Updated' })
      .mockResolvedValueOnce({ id: postId, isActive: false });

    await expect(
      forumService.create({ title: 'Help', content: 'Need advice', category: 'health' } as any, userId),
    ).resolves.toMatchObject({ id: postId });
    await expect(forumService.findAll('health')).resolves.toEqual({ posts: [{ id: postId }], total: 1 });
    await expect(forumService.toggleLike(postId, userId)).resolves.toMatchObject({
      likes: [{ id: 'like-id', userId }],
    });
    await expect(forumService.addReply(postId, { content: 'Reply' }, userId)).resolves.toMatchObject({
      replies: [{ id: 'reply-id' }],
    });
    await expect(forumService.update(postId, { title: 'Updated' } as any, userId)).resolves.toMatchObject({
      title: 'Updated',
    });
    await expect(forumService.delete(postId, userId)).resolves.toBeUndefined();
  });

  it('denies forum edits and deletes by non-authors', async () => {
    prisma.forumPost.findUnique
      .mockResolvedValueOnce({ id: postId, authorId: otherUserId })
      .mockResolvedValueOnce({ id: postId, authorId: otherUserId });

    await expect(forumService.update(postId, { title: 'Nope' } as any, userId)).rejects.toThrow(ForbiddenException);
    await expect(forumService.delete(postId, userId)).rejects.toThrow(ForbiddenException);
  });
});
