import { Document, Types } from 'mongoose';
export type AppointmentDocument = Appointment & Document;
export declare class Appointment {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    vetName: string;
    vetClinic: string;
    appointmentDate: Date;
    appointmentTime: string;
    reason: string;
    status: string;
    notes?: string;
    vetPhone?: string;
    vetEmail?: string;
    isActive: boolean;
}
export declare const AppointmentSchema: import("mongoose").Schema<Appointment, import("mongoose").Model<Appointment, any, any, any, Document<unknown, any, Appointment, any, {}> & Appointment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, import("mongoose").FlatRecord<Appointment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Appointment> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
