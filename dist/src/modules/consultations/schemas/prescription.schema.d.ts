import { Document, Types } from 'mongoose';
export type PrescriptionDocument = Prescription & Document;
export declare class Prescription {
    consultationId: Types.ObjectId;
    vetId: Types.ObjectId;
    petOwnerId: Types.ObjectId;
    petId: Types.ObjectId;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    warnings?: string;
    notes?: string;
    pdfUrl?: string;
    status: string;
}
export declare const PrescriptionSchema: import("mongoose").Schema<Prescription, import("mongoose").Model<Prescription, any, any, any, Document<unknown, any, Prescription, any, {}> & Prescription & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Prescription, Document<unknown, {}, import("mongoose").FlatRecord<Prescription>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Prescription> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
