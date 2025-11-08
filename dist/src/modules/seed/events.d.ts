import { Types } from 'mongoose';
export declare const sampleEvents: {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    title: string;
    description: string;
    eventDate: Date;
    eventTime: string;
    location: string;
    category: string;
    status: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}[];
