import { Document, Types, Schema as MongooseSchema } from 'mongoose';
export type NotificationPreferenceDocument = NotificationPreference & Document;
export declare class NotificationPreference {
    userId: Types.ObjectId;
    globalEnabled: boolean;
    petSettings: Record<string, {
        appointments: boolean;
        medications: boolean;
        vaccinations: boolean;
        checkups: boolean;
        healthAlerts: boolean;
        weightChanges: boolean;
    }>;
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderHoursBefore: number;
}
export declare const NotificationPreferenceSchema: MongooseSchema<NotificationPreference, import("mongoose").Model<NotificationPreference, any, any, any, Document<unknown, any, NotificationPreference, any, {}> & NotificationPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationPreference, Document<unknown, {}, import("mongoose").FlatRecord<NotificationPreference>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationPreference> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
