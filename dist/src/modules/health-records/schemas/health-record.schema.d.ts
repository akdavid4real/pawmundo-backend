import { Document, Types } from 'mongoose';
export declare class HealthRecord extends Document {
    petId: Types.ObjectId;
    type: string;
    title: string;
    description: string;
    date: Date;
    veterinarian: string;
    clinic: string;
    attachments: string[];
    nextDueDate: Date;
    weight: number;
    temperature: number;
    heartRate: number;
    cost: number;
    notes: string;
    isReminder: boolean;
    isCompleted: boolean;
    isActive: boolean;
}
export declare const HealthRecordSchema: import("mongoose").Schema<HealthRecord, import("mongoose").Model<HealthRecord, any, any, any, Document<unknown, any, HealthRecord, any, {}> & HealthRecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, HealthRecord, Document<unknown, {}, import("mongoose").FlatRecord<HealthRecord>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<HealthRecord> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
