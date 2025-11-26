import { Document, Types } from 'mongoose';
export type ConsultationDocument = Consultation & Document;
export declare class Consultation {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    assignedVet?: Types.ObjectId;
    veterinarianName?: string;
    status: string;
    scheduledDate: Date;
    duration: number;
    reason: string;
    symptoms?: string;
    notes?: string;
    prescription?: string;
    followUpRequired?: boolean;
    followUpDate?: Date;
    consultationType: string;
    meetingLink?: string;
    meetingId?: string;
    cost: number;
    paymentStatus: string;
    unreadCount: number;
    lastMessageAt?: Date;
    messages: Array<{
        id: string;
        text: string;
        sender: 'user' | 'doctor';
        timestamp: Date;
        isRead: boolean;
    }>;
    isActive: boolean;
}
export declare const ConsultationSchema: import("mongoose").Schema<Consultation, import("mongoose").Model<Consultation, any, any, any, Document<unknown, any, Consultation, any, {}> & Consultation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Consultation, Document<unknown, {}, import("mongoose").FlatRecord<Consultation>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Consultation> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
