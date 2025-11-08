import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document;
export declare class Notification {
    userId: Types.ObjectId;
    petId?: Types.ObjectId;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    actionUrl?: string;
    metadata?: Record<string, any>;
    isActive: boolean;
}
export declare const NotificationSchema: import("mongoose").Schema<Notification, import("mongoose").Model<Notification, any, any, any, Document<unknown, any, Notification, any, {}> & Notification & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Notification, Document<unknown, {}, import("mongoose").FlatRecord<Notification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Notification> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
