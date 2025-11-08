import { Document, Types } from 'mongoose';
export type InsuranceClaimDocument = InsuranceClaim & Document;
export declare class InsuranceClaim {
    insuranceId: Types.ObjectId;
    userId: Types.ObjectId;
    claimAmount: number;
    description: string;
    serviceDate: Date;
    provider?: string;
    treatmentType?: string;
    status: string;
    approvedAmount?: number;
    denialReason?: string;
    processedDate?: Date;
    isActive: boolean;
}
export declare const InsuranceClaimSchema: import("mongoose").Schema<InsuranceClaim, import("mongoose").Model<InsuranceClaim, any, any, any, Document<unknown, any, InsuranceClaim, any, {}> & InsuranceClaim & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InsuranceClaim, Document<unknown, {}, import("mongoose").FlatRecord<InsuranceClaim>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<InsuranceClaim> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
