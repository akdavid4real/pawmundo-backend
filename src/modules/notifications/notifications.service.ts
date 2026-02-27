import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { NotificationType, Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) { }

  async create(createDto: CreateNotificationDto) {
    const shouldSend = await this.shouldSendNotification(createDto.userId, createDto.petId, createDto.type);
    if (!shouldSend) return null;

    // Check for duplicate notification (same user, pet, type, and title within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        userId: createDto.userId,
        petId: createDto.petId || undefined,
        type: createDto.type as NotificationType,
        title: createDto.title,
        createdAt: { gte: oneDayAgo },
      },
    });

    if (existingNotification) {
      return existingNotification;
    }

    const data: Prisma.NotificationUncheckedCreateInput = {
      userId: createDto.userId,
      petId: createDto.petId || undefined,
      title: createDto.title,
      message: createDto.message,
      type: createDto.type as NotificationType,
      actionUrl: createDto.actionUrl,
    };

    return this.prisma.notification.create({ data });
  }

  async findAllByUser(userId: string, petId?: string) {
    const where: Prisma.NotificationWhereInput = { userId, isActive: true };
    if (petId) where.petId = petId;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false, isActive: true },
    });
  }

  async getPreferences(userId: string) {
    let prefs = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!prefs) {
      prefs = await this.prisma.notificationPreference.create({
        data: { userId, petSettings: {} },
      });
    }
    return prefs;
  }

  async updatePreferences(userId: string, updateDto: UpdatePreferenceDto) {
    try {
      const prefs = await this.getPreferences(userId);

      const updateData: Prisma.NotificationPreferenceUncheckedUpdateInput = {};
      if (updateDto.globalEnabled !== undefined) updateData.globalEnabled = updateDto.globalEnabled;
      if (updateDto.emailNotifications !== undefined) updateData.emailNotifications = updateDto.emailNotifications;
      if (updateDto.pushNotifications !== undefined) updateData.pushNotifications = updateDto.pushNotifications;
      if (updateDto.reminderHoursBefore !== undefined) updateData.reminderHoursBefore = updateDto.reminderHoursBefore;

      if (updateDto.petId && updateDto.petSettings) {
        const currentPetSettings = (prefs.petSettings as Record<string, unknown>) || {};
        currentPetSettings[updateDto.petId] = updateDto.petSettings;
        updateData.petSettings = currentPetSettings as Prisma.InputJsonValue;
      }

      return this.prisma.notificationPreference.update({
        where: { userId },
        data: updateData,
      });
    } catch (error) {
      console.error('Service update preferences error:', error);
      throw error;
    }
  }

  private async shouldSendNotification(userId: string, petId: string | undefined, type: string): Promise<boolean> {
    const prefs = await this.getPreferences(userId);
    if (!prefs.globalEnabled) return false;

    if (petId) {
      const petSettings = (prefs.petSettings as Record<string, Record<string, boolean>>)?.[petId];
      if (!petSettings) return true;

      const typeMap: Record<string, boolean | undefined> = {
        'appointment_notification': petSettings.appointments,
        'medication_notification': petSettings.medications,
        'vaccination': petSettings.vaccinations,
        'checkup': petSettings.checkups,
        'health_alert': petSettings.healthAlerts,
        'weight_notification': petSettings.weightChanges,
      };

      return typeMap[type] !== false;
    }

    return true;
  }

  async notifyAppointment(userId: string, petId: string, appointmentDate: Date, vetName: string) {
    await this.create({
      userId,
      petId,
      title: 'Upcoming Appointment',
      message: `Appointment with ${vetName} on ${appointmentDate.toLocaleDateString()}`,
      type: 'appointment_notification',
      actionUrl: `/appointments`,
    });
  }

  async notifyMedication(userId: string, petId: string, medicationName: string) {
    await this.create({
      userId,
      petId,
      title: 'Medication Reminder',
      message: `Time to give ${medicationName}`,
      type: 'medication_notification',
      actionUrl: `/pets/${petId}/medications`,
    });
  }

  async notifyVaccination(userId: string, petId: string, vaccineName: string, dueDate: Date) {
    await this.create({
      userId,
      petId,
      title: 'Vaccination Due',
      message: `${vaccineName} vaccination due on ${dueDate.toLocaleDateString()}`,
      type: 'vaccination',
      actionUrl: `/pets/${petId}/health-records`,
    });
  }

  async removeDuplicates(userId: string): Promise<number> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const seen = new Map<string, string>();
    const duplicateIds: string[] = [];

    for (const notif of notifications) {
      const key = `${notif.userId}-${notif.petId}-${notif.type}-${notif.title}`;
      if (seen.has(key)) {
        duplicateIds.push(notif.id);
      } else {
        seen.set(key, notif.id);
      }
    }

    if (duplicateIds.length > 0) {
      await this.prisma.notification.deleteMany({
        where: { id: { in: duplicateIds } },
      });
    }

    return duplicateIds.length;
  }
}
