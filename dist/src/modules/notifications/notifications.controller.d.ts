import { NotificationsService } from './notifications.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any, petId?: string): Promise<import("./schemas/notification.schema").Notification[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(id: string, req: any): Promise<import("./schemas/notification.schema").Notification>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
    getPreferences(req: any): Promise<import("./schemas/notification-preference.schema").NotificationPreferenceDocument>;
    updatePreferences(req: any, updateDto: UpdatePreferenceDto): Promise<import("./schemas/notification-preference.schema").NotificationPreferenceDocument>;
    removeDuplicates(req: any): Promise<{
        success: boolean;
        removed: number;
    }>;
}
