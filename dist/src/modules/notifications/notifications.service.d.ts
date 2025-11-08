import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { NotificationPreferenceDocument } from './schemas/notification-preference.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
export declare class NotificationsService {
    private notificationModel;
    private preferenceModel;
    constructor(notificationModel: Model<NotificationDocument>, preferenceModel: Model<NotificationPreferenceDocument>);
    create(createDto: CreateNotificationDto): Promise<Notification>;
    findAllByUser(userId: string, petId?: string): Promise<Notification[]>;
    markAsRead(notificationId: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    getPreferences(userId: string): Promise<NotificationPreferenceDocument>;
    updatePreferences(userId: string, updateDto: UpdatePreferenceDto): Promise<NotificationPreferenceDocument>;
    private shouldSendNotification;
    notifyAppointment(userId: string, petId: string, appointmentDate: Date, vetName: string): Promise<void>;
    notifyMedication(userId: string, petId: string, medicationName: string): Promise<void>;
    notifyVaccination(userId: string, petId: string, vaccineName: string, dueDate: Date): Promise<void>;
    removeDuplicates(userId: string): Promise<number>;
}
