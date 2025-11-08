import { Types } from 'mongoose';
declare const sampleNotifications: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}[];
export { sampleNotifications };
