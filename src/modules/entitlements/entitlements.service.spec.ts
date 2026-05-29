import { ForbiddenException } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';

describe('EntitlementsService', () => {
  const mockPrisma = {
    userSubscription: { findUnique: jest.fn() },
    pet: { count: jest.fn() },
    entitlementUsage: { count: jest.fn(), create: jest.fn() },
  };
  let service: EntitlementsService;

  beforeEach(() => {
    service = new EntitlementsService(mockPrisma as any);
  });

  afterEach(() => jest.clearAllMocks());

  it('normalizes missing and expired subscriptions to free', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValueOnce(null);
    await expect(service.getEffectivePlan('user-id')).resolves.toBe('free');

    mockPrisma.userSubscription.findUnique.mockResolvedValueOnce({
      plan: 'pro',
      isActive: true,
      expiresAt: new Date(Date.now() - 1000),
    });
    await expect(service.getEffectivePlan('user-id')).resolves.toBe('free');
  });

  it('allows free users within monthly AI and symptom checker quotas', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValue(null);
    mockPrisma.entitlementUsage.count
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(1);

    await expect(service.requireAiChat('user-id')).resolves.toBe('free');
    await expect(service.requireSymptomChecker('user-id')).resolves.toBe('free');
    expect(mockPrisma.entitlementUsage.count).toHaveBeenNthCalledWith(1, {
      where: expect.objectContaining({
        userId: 'user-id',
        feature: 'ai_chat',
      }),
    });
    expect(mockPrisma.entitlementUsage.count).toHaveBeenNthCalledWith(2, {
      where: expect.objectContaining({
        userId: 'user-id',
        feature: 'symptom_checker',
      }),
    });
  });

  it('rejects free users after monthly AI and symptom checker quotas are exhausted', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValue(null);
    mockPrisma.entitlementUsage.count
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2);

    await expect(service.requireAiChat('user-id')).rejects.toBeInstanceOf(ForbiddenException);
    await expect(service.requireSymptomChecker('user-id')).rejects.toThrow('Free plan includes 2 Symptom checker uses per month');
  });

  it('records monthly usage only for free users', async () => {
    mockPrisma.entitlementUsage.create.mockResolvedValue({ id: 'usage-id' });

    await service.recordFreeMonthlyUsage('free-user-id', 'ai_chat', 'free');
    await service.recordFreeMonthlyUsage('plus-user-id', 'ai_chat', 'plus');

    expect(mockPrisma.entitlementUsage.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.entitlementUsage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'free-user-id',
        feature: 'ai_chat',
      }),
    });
  });

  it('enforces free and plus pet limits', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValueOnce(null);
    mockPrisma.pet.count.mockResolvedValueOnce(1);
    await expect(service.requireCanCreatePet('user-id')).rejects.toThrow('Free plan allows 1 active pet profile');

    mockPrisma.userSubscription.findUnique.mockResolvedValueOnce({
      plan: 'plus',
      isActive: true,
      expiresAt: null,
    });
    mockPrisma.pet.count.mockResolvedValueOnce(5);
    await expect(service.requireCanCreatePet('user-id')).rejects.toThrow('Plus plan allows up to 5 active pet profiles');
  });

  it('allows pro users to create unlimited pets and video consultations', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValue({
      plan: 'pro',
      isActive: true,
      expiresAt: null,
    });

    await expect(service.requireCanCreatePet('user-id')).resolves.toBeUndefined();
    await expect(service.requireConsultation('user-id', 'video')).resolves.toBe('pro');
    expect(mockPrisma.pet.count).not.toHaveBeenCalled();
  });

  it('requires pro for video consultations', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValue({
      plan: 'plus',
      isActive: true,
      expiresAt: null,
    });

    await expect(service.requireConsultation('user-id', 'video')).rejects.toThrow('Video consultations requires an active Pro subscription');
  });
});
