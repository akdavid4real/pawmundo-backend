import { Document, Types } from 'mongoose';
export type InsuranceDocument = Insurance & Document;
export declare class Insurance {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    provider: string;
    policyNumber: string;
    planType: string;
    monthlyPremium: number;
    deductible: number;
    coverageLimit: number;
    startDate: Date;
    endDate: Date;
    status: string;
    notes?: string;
    isActive: boolean;
}
export declare const InsuranceSchema: import("mongoose").Schema<Insurance, import("mongoose").Model<Insurance, any, any, any, Document<unknown, any, Insurance, any, {}> & Insurance & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Insurance, Document<unknown, {}, import("mongoose").FlatRecord<Insurance>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Insurance> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
