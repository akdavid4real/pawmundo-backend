import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type EffectivePlan = 'free' | 'plus' | 'pro';
export type EntitlementFeature = 'ai_chat' | 'symptom_checker';

const PET_LIMITS: Record<EffectivePlan, number | null> = {
  free: 1,
  plus: 5,
  pro: null,
};

const FREE_MONTHLY_FEATURE_LIMITS: Record<EntitlementFeature, number> = {
  ai_chat: 5,
  symptom_checker: 2,
};

const FEATURE_NAMES: Record<EntitlementFeature, string> = {
  ai_chat: 'AI Vet Chat',
  symptom_checker: 'Symptom checker',
};

@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  async getEffectivePlan(userId: string): Promise<EffectivePlan> {
    const subscription = await this.prisma.userSubscription.findUnique({
      where: { userId },
    });
    const expiresAt = subscription?.expiresAt ? new Date(subscription.expiresAt) : null;
    const isExpired = expiresAt ? expiresAt.getTime() <= Date.now() : false;

    if (!subscription?.isActive || isExpired) {
      return 'free';
    }

    return subscription.plan === 'plus' || subscription.plan === 'pro'
      ? subscription.plan
      : 'free';
  }

  async requirePaid(userId: string, featureName: string): Promise<EffectivePlan> {
    const plan = await this.getEffectivePlan(userId);
    if (plan === 'free') {
      throw new ForbiddenException(`${featureName} requires an active Plus or Pro subscription.`);
    }
    return plan;
  }

  async requirePro(userId: string, featureName: string): Promise<EffectivePlan> {
    const plan = await this.getEffectivePlan(userId);
    if (plan !== 'pro') {
      throw new ForbiddenException(`${featureName} requires an active Pro subscription.`);
    }
    return plan;
  }

  async requireCanCreatePet(userId: string) {
    const plan = await this.getEffectivePlan(userId);
    const limit = PET_LIMITS[plan];
    if (limit === null) return;

    const activePetCount = await this.prisma.pet.count({
      where: { ownerId: userId, isActive: true },
    });

    if (activePetCount >= limit) {
      throw new ForbiddenException(
        plan === 'free'
          ? 'Free plan allows 1 active pet profile. Upgrade to Plus for up to 5 pets or Pro for unlimited pets.'
          : 'Plus plan allows up to 5 active pet profiles. Upgrade to Pro for unlimited pets.',
      );
    }
  }

  async requireFreeMonthlyQuota(
    userId: string,
    feature: EntitlementFeature,
    now = new Date(),
  ) {
    const limit = FREE_MONTHLY_FEATURE_LIMITS[feature];
    const { periodStart, periodEnd } = this.getMonthlyPeriod(now);
    const used = await this.prisma.entitlementUsage.count({
      where: {
        userId,
        feature,
        periodStart,
      },
    });

    if (used >= limit) {
      throw new ForbiddenException({
        message: `Free plan includes ${limit} ${FEATURE_NAMES[feature]} use${limit === 1 ? '' : 's'} per month. Upgrade to Plus or Pro for unlimited access.`,
        details: {
          feature,
          plan: 'free',
          limit,
          used,
          remaining: 0,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
        },
      });
    }

    return {
      limit,
      used,
      remaining: limit - used,
      periodStart,
      periodEnd,
    };
  }

  async recordFreeMonthlyUsage(
    userId: string,
    feature: EntitlementFeature,
    plan?: EffectivePlan,
    now = new Date(),
  ) {
    const effectivePlan = plan ?? await this.getEffectivePlan(userId);
    if (effectivePlan !== 'free') return;

    const { periodStart } = this.getMonthlyPeriod(now);
    await this.prisma.entitlementUsage.create({
      data: {
        userId,
        feature,
        periodStart,
      },
    });
  }

  async requireAiChat(userId: string) {
    const plan = await this.getEffectivePlan(userId);
    if (plan !== 'free') return plan;

    await this.requireFreeMonthlyQuota(userId, 'ai_chat');
    return plan;
  }

  async requireSymptomChecker(userId: string) {
    const plan = await this.getEffectivePlan(userId);
    if (plan !== 'free') return plan;

    await this.requireFreeMonthlyQuota(userId, 'symptom_checker');
    return plan;
  }

  async requirePhotoGallery(userId: string) {
    return this.requirePaid(userId, 'Photo gallery');
  }

  async requireConsultation(userId: string, consultationType?: string) {
    const normalizedType = consultationType?.toLowerCase();
    if (normalizedType === 'video') {
      return this.requirePro(userId, 'Video consultations');
    }
    return this.requirePaid(userId, 'Vet consultations');
  }

  private getMonthlyPeriod(now: Date) {
    const periodStart = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1,
      0,
      0,
      0,
      0,
    ));
    const periodEnd = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    ));

    return { periodStart, periodEnd };
  }
}
