import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationPreference, NotificationPreferenceDocument } from './schemas/notification-preference.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationPreference.name) private preferenceModel: Model<NotificationPreferenceDocument>,
  ) {}

  async create(createDto: CreateNotificationDto): Promise<Notification> {
    const shouldSend = await this.shouldSendNotification(createDto.userId, createDto.petId, createDto.type);
    if (!shouldSend) return null;

    const notification = new this.notificationModel(createDto);
    return notification.save();
  }

  async findAllByUser(userId: string, petId?: string): Promise<Notification[]> {
    const query: any = { userId: new Types.ObjectId(userId), isActive: true };
    if (petId) query.petId = new Types.ObjectId(petId);
    
    return this.notificationModel.find(query).sort({ createdAt: -1 }).limit(50).exec();
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    return this.notificationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(notificationId), userId: new Types.ObjectId(userId) },
      { isRead: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    ).exec();
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
      isActive: true
    }).exec();
  }

  async getPreferences(userId: string): Promise<NotificationPreferenceDocument> {
    let prefs = await this.preferenceModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!prefs) {
      prefs = await this.preferenceModel.create({ userId: new Types.ObjectId(userId), petSettings: {} });
    }
    return prefs;
  }

  async updatePreferences(userId: string, updateDto: UpdatePreferenceDto): Promise<NotificationPreferenceDocument> {
    try {
      const prefs = await this.getPreferences(userId);
      
      if (updateDto.globalEnabled !== undefined) prefs.globalEnabled = updateDto.globalEnabled;
      if (updateDto.emailNotifications !== undefined) prefs.emailNotifications = updateDto.emailNotifications;
      if (updateDto.pushNotifications !== undefined) prefs.pushNotifications = updateDto.pushNotifications;
      if (updateDto.reminderHoursBefore !== undefined) prefs.reminderHoursBefore = updateDto.reminderHoursBefore;
      
      if (updateDto.petId && updateDto.petSettings) {
        if (!prefs.petSettings) prefs.petSettings = {};
        prefs.petSettings[updateDto.petId] = updateDto.petSettings as any;
        prefs.markModified('petSettings');
      }
      
      return await prefs.save();
    } catch (error) {
      console.error('Service update preferences error:', error);
      throw error;
    }
  }

  private async shouldSendNotification(userId: string, petId: string | undefined, type: string): Promise<boolean> {
    const prefs = await this.getPreferences(userId);
    if (!prefs.globalEnabled) return false;
    
    if (petId) {
      const petSettings = prefs.petSettings[petId];
      if (!petSettings) return true;
      
      const typeMap = {
        'appointment': petSettings.appointments,
        'medication': petSettings.medications,
        'vaccination': petSettings.vaccinations,
        'checkup': petSettings.checkups,
        'health_alert': petSettings.healthAlerts,
        'weight': petSettings.weightChanges,
      };
      
      return typeMap[type] !== false;
    }
    
    return true;
  }

  async notifyAppointment(userId: string, petId: string, appointmentDate: Date, vetName: string): Promise<void> {
    await this.create({
      userId,
      petId,
      title: 'Upcoming Appointment',
      message: `Appointment with ${vetName} on ${appointmentDate.toLocaleDateString()}`,
      type: 'appointment',
      actionUrl: `/appointments`,
    });
  }

  async notifyMedication(userId: string, petId: string, medicationName: string): Promise<void> {
    await this.create({
      userId,
      petId,
      title: 'Medication Reminder',
      message: `Time to give ${medicationName}`,
      type: 'medication',
      actionUrl: `/pets/${petId}/medications`,
    });
  }

  async notifyVaccination(userId: string, petId: string, vaccineName: string, dueDate: Date): Promise<void> {
    await this.create({
      userId,
      petId,
      title: 'Vaccination Due',
      message: `${vaccineName} vaccination due on ${dueDate.toLocaleDateString()}`,
      type: 'vaccination',
      actionUrl: `/pets/${petId}/health-records`,
    });
  }
}
