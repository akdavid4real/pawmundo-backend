import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from './payments.service';

jest.mock('axios');

describe('Payments subscription lifecycle DB-free coverage', () => {
  const mockHttp = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const prisma = {
    userSubscription: {
      findUnique: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const configuredConfig = {
    get: jest.fn((key: string) => {
      if (key === 'PAYSTACK_SECRET_KEY') return 'test-secret';
      if (key === 'PAYSTACK_BASE_URL') return 'https://paystack.test';
      return undefined;
    }),
  };

  const buildService = (config: any = configuredConfig) => {
    (axios.create as jest.Mock).mockReturnValue(mockHttp);
    return new PaymentsService(
      config as unknown as ConfigService,
      prisma as unknown as PrismaService,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns active Plus or Pro subscription state as backend truth', async () => {
    const service = buildService();
    prisma.userSubscription.findUnique.mockResolvedValueOnce({
      userId: 'user-id',
      plan: 'pro',
      billingCycle: 'yearly',
      currency: 'USD',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    await expect(service.getCurrentSubscription('user-id')).resolves.toMatchObject({
      plan: 'pro',
      billingCycle: 'yearly',
      currency: 'USD',
      isActive: true,
    });

    expect(prisma.userSubscription.update).not.toHaveBeenCalled();
  });

  it('downgrades expired subscriptions to Free before returning current state', async () => {
    const service = buildService();
    prisma.userSubscription.findUnique.mockResolvedValueOnce({
      userId: 'user-id',
      plan: 'plus',
      billingCycle: 'monthly',
      currency: 'NGN',
      expiresAt: new Date(Date.now() - 1000),
      isActive: true,
    });
    prisma.userSubscription.update.mockResolvedValueOnce({});

    await expect(service.getCurrentSubscription('user-id')).resolves.toEqual({
      plan: 'free',
      billingCycle: 'monthly',
      currency: 'NGN',
      expiresAt: null,
      isActive: false,
    });

    expect(prisma.userSubscription.update).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      data: { isActive: false, plan: 'free', billingCycle: 'monthly' },
    });
  });

  it('initializes a Plus monthly payment with Paystack metadata for the authenticated user', async () => {
    const service = buildService();
    mockHttp.post.mockResolvedValueOnce({
      data: {
        data: {
          authorization_url: 'https://paystack.test/authorize',
          access_code: 'access-code',
          reference: 'ref-123',
        },
      },
    });

    const result = await service.initialize(
      { id: 'user-id', email: 'owner@example.com' },
      {
        plan: 'plus',
        billingCycle: 'monthly',
        currency: 'NGN',
        callbackUrl: 'https://app.example/payments/callback',
      },
    );

    expect(mockHttp.post).toHaveBeenCalledWith('/transaction/initialize', {
      email: 'owner@example.com',
      amount: 499900,
      currency: 'NGN',
      callback_url: 'https://app.example/payments/callback',
      metadata: {
        userId: 'user-id',
        plan: 'plus',
        billingCycle: 'monthly',
      },
    });
    expect(result).toMatchObject({
      authorizationUrl: 'https://paystack.test/authorize',
      accessCode: 'access-code',
      reference: 'ref-123',
    });
  });

  it('does not call Paystack when the payment provider is not configured', async () => {
    const service = buildService({
      get: jest.fn(() => ''),
    });

    await expect(
      service.initialize(
        { id: 'user-id', email: 'owner@example.com' },
        {
          plan: 'plus',
          billingCycle: 'monthly',
          currency: 'NGN',
          callbackUrl: 'https://app.example/payments/callback',
        },
      ),
    ).rejects.toThrow(ServiceUnavailableException);

    expect(mockHttp.post).not.toHaveBeenCalled();
  });

  it('rejects unsupported plan/currency combinations before Paystack initialization', async () => {
    const service = buildService();

    await expect(
      service.initialize(
        { id: 'user-id', email: 'owner@example.com' },
        {
          plan: 'plus',
          billingCycle: 'monthly',
          currency: 'EUR' as any,
          callbackUrl: 'https://app.example/payments/callback',
        },
      ),
    ).rejects.toThrow(BadRequestException);

    expect(mockHttp.post).not.toHaveBeenCalled();
  });

  it('does not upsert subscription state for failed payment verification', async () => {
    const service = buildService();
    mockHttp.get.mockResolvedValueOnce({
      data: {
        data: {
          status: 'failed',
          reference: 'ref-123',
          amount: 499900,
          currency: 'NGN',
          metadata: {
            userId: 'user-id',
            plan: 'plus',
            billingCycle: 'monthly',
          },
        },
      },
    });

    await expect(service.verify('user-id', 'ref-123')).resolves.toEqual({
      status: 'failed',
      reference: 'ref-123',
    });

    expect(prisma.userSubscription.upsert).not.toHaveBeenCalled();
  });

  it('rejects successful verification when subscription metadata is missing', async () => {
    const service = buildService();
    mockHttp.get.mockResolvedValueOnce({
      data: {
        data: {
          status: 'success',
          reference: 'ref-123',
          amount: 499900,
          currency: 'NGN',
          metadata: {
            userId: 'user-id',
          },
        },
      },
    });

    await expect(service.verify('user-id', 'ref-123')).rejects.toThrow(BadRequestException);
    expect(prisma.userSubscription.upsert).not.toHaveBeenCalled();
  });

  it('upserts successful Pro yearly verification into mocked subscription state', async () => {
    const service = buildService();
    mockHttp.get.mockResolvedValueOnce({
      data: {
        data: {
          status: 'success',
          reference: 'ref-pro-yearly',
          amount: 9999900,
          currency: 'NGN',
          metadata: {
            userId: 'user-id',
            plan: 'pro',
            billingCycle: 'yearly',
          },
        },
      },
    });
    prisma.userSubscription.upsert.mockResolvedValueOnce({
      userId: 'user-id',
      plan: 'pro',
      billingCycle: 'yearly',
      currency: 'NGN',
      paystackReference: 'ref-pro-yearly',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const result = await service.verify('user-id', 'ref-pro-yearly');

    expect(mockHttp.get).toHaveBeenCalledWith('/transaction/verify/ref-pro-yearly');
    expect(prisma.userSubscription.upsert).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      create: expect.objectContaining({
        userId: 'user-id',
        plan: 'pro',
        billingCycle: 'yearly',
        paystackReference: 'ref-pro-yearly',
        isActive: true,
      }),
      update: expect.objectContaining({
        plan: 'pro',
        billingCycle: 'yearly',
        paystackReference: 'ref-pro-yearly',
        isActive: true,
      }),
    });
    expect(result.subscription).toMatchObject({
      plan: 'pro',
      billingCycle: 'yearly',
      isActive: true,
    });
  });
});
