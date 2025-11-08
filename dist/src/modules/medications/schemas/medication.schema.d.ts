import { Document, Types } from 'mongoose';
export type MedicationDocument = Medication & Document;
export declare class Medication {
    petId: Types.ObjectId;
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
    instructions?: string;
    veterinarian?: string;
    isActive: boolean;
    isCompleted: boolean;
}
export declare const MedicationSchema: import("mongoose").Schema<Medication, import("mongoose").Model<Medication, any, any, any, Document<unknown, any, Medication, any, {}> & Medication & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Medication, Document<unknown, {}, import("mongoose").FlatRecord<Medication>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Medication> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
