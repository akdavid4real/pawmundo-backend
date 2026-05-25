import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
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

@Injectable()
export class PaymentsService {
  private readonly http: AxiosInstance;
  private readonly secretKey: string;

  constructor(private readonly configService: ConfigService) {
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
    const expiresAt =
      billingCycle === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    return {
      status: data.status,
      reference: data.reference,
      plan,
      billingCycle,
      expiresAt,
      subscription: {
        plan,
        billingCycle,
        expiresAt,
      },
    };
  }
}
