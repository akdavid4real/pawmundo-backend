import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

jest.mock('axios');

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockHttp = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'PAYSTACK_SECRET_KEY') return 'test-secret';
      if (key === 'PAYSTACK_BASE_URL') return 'https://paystack.test';
      return undefined;
    }),
  };

  const mockPrismaService = {
    userSubscription: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.create as jest.Mock).mockReturnValue(mockHttp);
    service = new PaymentsService(
      mockConfigService as unknown as ConfigService,
      mockPrismaService as unknown as PrismaService,
    );
  });

  describe('getCurrentSubscription', () => {
    it('returns a free entitlement when the user has no subscription row', async () => {
      mockPrismaService.userSubscription.findUnique.mockResolvedValue(null);

      await expect(service.getCurrentSubscription('user-1')).resolves.toEqual({
        plan: 'free',
        billingCycle: 'monthly',
        currency: 'NGN',
        expiresAt: null,
        isActive: false,
      });
    });

    it('expires stale paid entitlements before returning backend truth', async () => {
      mockPrismaService.userSubscription.findUnique.mockResolvedValue({
        userId: 'user-1',
        plan: 'plus',
        billingCycle: 'monthly',
        currency: 'NGN',
        expiresAt: new Date('2024-01-01T00:00:00.000Z'),
        isActive: true,
      });
      mockPrismaService.userSubscription.update.mockResolvedValue({});

      await expect(service.getCurrentSubscription('user-1')).resolves.toMatchObject({
        plan: 'free',
        billingCycle: 'monthly',
        isActive: false,
      });
      expect(mockPrismaService.userSubscription.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { isActive: false, plan: 'free', billingCycle: 'monthly' },
      });
    });
  });

  describe('verify', () => {
    it('persists a successful Paystack verification as the current entitlement', async () => {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      mockHttp.get.mockResolvedValue({
        data: {
          data: {
            status: 'success',
            reference: 'ref-123',
            amount: 499900,
            currency: 'NGN',
            metadata: {
              userId: 'user-1',
              plan: 'plus',
              billingCycle: 'monthly',
            },
          },
        },
      });
      mockPrismaService.userSubscription.upsert.mockResolvedValue({
        userId: 'user-1',
        plan: 'plus',
        billingCycle: 'monthly',
        currency: 'NGN',
        paystackReference: 'ref-123',
        expiresAt,
        isActive: true,
      });

      const result = await service.verify('user-1', 'ref-123');

      expect(mockPrismaService.userSubscription.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        create: expect.objectContaining({
          userId: 'user-1',
          plan: 'plus',
          billingCycle: 'monthly',
          currency: 'NGN',
          paystackReference: 'ref-123',
          isActive: true,
        }),
        update: expect.objectContaining({
          plan: 'plus',
          billingCycle: 'monthly',
          currency: 'NGN',
          paystackReference: 'ref-123',
          isActive: true,
        }),
      });
      expect(result).toMatchObject({
        status: 'success',
        reference: 'ref-123',
        subscription: {
          plan: 'plus',
          billingCycle: 'monthly',
          currency: 'NGN',
          isActive: true,
        },
      });
    });

    it('rejects a reference that belongs to another user', async () => {
      mockHttp.get.mockResolvedValue({
        data: {
          data: {
            status: 'success',
            reference: 'ref-123',
            amount: 499900,
            currency: 'NGN',
            metadata: {
              userId: 'other-user',
              plan: 'plus',
              billingCycle: 'monthly',
            },
          },
        },
      });

      await expect(service.verify('user-1', 'ref-123')).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.userSubscription.upsert).not.toHaveBeenCalled();
    });
  });
});
