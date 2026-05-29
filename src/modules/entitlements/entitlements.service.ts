import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type EffectivePlan = 'free' | 'plus' | 'pro';

const PET_LIMITS: Record<EffectivePlan, number | null> = {
  free: 1,
  plus: 5,
  pro: null,
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

  async requireAiChat(userId: string) {
    return this.requirePaid(userId, 'AI Vet Chat');
  }

  async requireSymptomChecker(userId: string) {
    return this.requirePaid(userId, 'Symptom checker');
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
}
