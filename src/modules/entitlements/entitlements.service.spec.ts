import { ForbiddenException } from '@nestjs/common';
import { EntitlementsService } from './entitlements.service';

describe('EntitlementsService', () => {
  const mockPrisma = {
    userSubscription: { findUnique: jest.fn() },
    pet: { count: jest.fn() },
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

  it('rejects paid features for free users', async () => {
    mockPrisma.userSubscription.findUnique.mockResolvedValue(null);

    await expect(service.requireSymptomChecker('user-id')).rejects.toBeInstanceOf(ForbiddenException);
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
