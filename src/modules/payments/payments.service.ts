import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { InitializePaystackPaymentDto } from './dto/initialize-paystack-payment.dto';

type PaystackData<T> = {
  status: boolean;
  message: string;
  data: T;
};

type PaystackInitializeData = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type PaystackVerifyData = {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  metadata?: {
    userId?: string;
    plan?: 'plus' | 'pro';
    billingCycle?: 'monthly' | 'yearly';
  };
};

const PLAN_AMOUNTS: Record<string, Record<string, Record<string, number>>> = {
  NGN: {
    plus: { monthly: 499900, yearly: 4999900 },
    pro: { monthly: 999900, yearly: 9999900 },
  },
  USD: {
    plus: { monthly: 499, yearly: 4999 },
    pro: { monthly: 999, yearly: 9999 },
  },
};

type SubscriptionPlan = 'free' | 'plus' | 'pro';
type SubscriptionBillingCycle = 'monthly' | 'yearly';

@Injectable()
export class PaymentsService {
  private readonly http: AxiosInstance;
  private readonly secretKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
    this.http = axios.create({
      baseURL: this.configService.get<string>('PAYSTACK_BASE_URL') || 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private assertConfigured() {
    if (!this.secretKey) {
      throw new ServiceUnavailableException('Paystack is not configured.');
    }
  }

  private formatSubscription(subscription?: any) {
    if (!subscription) {
      return {
        plan: 'free' as SubscriptionPlan,
        billingCycle: 'monthly' as SubscriptionBillingCycle,
        currency: 'NGN',
        expiresAt: null,
        isActive: false,
      };
    }

    const expiresAt = subscription.expiresAt
      ? new Date(subscription.expiresAt)
      : null;
    const isActive =
      subscription.plan !== 'free' &&
      subscription.isActive &&
      (!expiresAt || expiresAt.getTime() > Date.now());

    return {
      plan: isActive ? subscription.plan : ('free' as SubscriptionPlan),
      billingCycle: isActive ? subscription.billingCycle : ('monthly' as SubscriptionBillingCycle),
      currency: subscription.currency || 'NGN',
      expiresAt: isActive && expiresAt ? expiresAt.toISOString() : null,
      isActive,
    };
  }

  async getCurrentSubscription(userId: string) {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });

    if (
      subscription?.isActive &&
      subscription.expiresAt &&
      subscription.expiresAt.getTime() <= Date.now()
    ) {
      await this.prisma.userSubscription.update({
        where: { userId },
        data: { isActive: false, plan: 'free', billingCycle: 'monthly' },
      });
      return this.formatSubscription(null);
    }

    return this.formatSubscription(subscription);
  }

  async initialize(user: { id: string; email: string }, dto: InitializePaystackPaymentDto) {
    this.assertConfigured();

    const amount = PLAN_AMOUNTS[dto.currency]?.[dto.plan]?.[dto.billingCycle];
    if (!amount) {
      throw new BadRequestException('Unsupported subscription plan.');
    }

    const response = await this.http.post<PaystackData<PaystackInitializeData>>('/transaction/initialize', {
      email: user.email,
      amount,
      currency: dto.currency,
      callback_url: dto.callbackUrl,
      metadata: {
        userId: user.id,
        plan: dto.plan,
        billingCycle: dto.billingCycle,
      },
    });

    const data = response.data.data;
    return {
      authorizationUrl: data.authorization_url,
      authorization_url: data.authorization_url,
      accessCode: data.access_code,
      access_code: data.access_code,
      reference: data.reference,
    };
  }

  async verify(userId: string, reference: string) {
    this.assertConfigured();

    const response = await this.http.get<PaystackData<PaystackVerifyData>>(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );
    const data = response.data.data;

    if (data.metadata?.userId && data.metadata.userId !== userId) {
      throw new BadRequestException('Payment reference does not belong to this user.');
    }

    if (data.status !== 'success') {
      return {
        status: data.status,
        reference: data.reference,
      };
    }

    const plan = data.metadata?.plan;
    const billingCycle = data.metadata?.billingCycle;

    if (!plan || !billingCycle) {
      throw new BadRequestException('Payment metadata is missing subscription details.');
    }

    const expiresAt =
      billingCycle === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const subscription = await this.prisma.userSubscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        billingCycle,
        currency: data.currency || 'NGN',
        paystackReference: data.reference,
        expiresAt: new Date(expiresAt),
        isActive: true,
      },
      update: {
        plan,
        billingCycle,
        currency: data.currency || 'NGN',
        paystackReference: data.reference,
        expiresAt: new Date(expiresAt),
        isActive: true,
      },
    });

    return {
      status: data.status,
      reference: data.reference,
      subscription: this.formatSubscription(subscription),
    };
  }
}
