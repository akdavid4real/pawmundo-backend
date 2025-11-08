import { Document, Types } from 'mongoose';
export declare class SymptomCheck extends Document {
    userId: Types.ObjectId;
    petId: Types.ObjectId;
    petName: string;
    symptoms: string[];
    duration: string;
    severity: string;
    additionalInfo?: string;
    urgencyLevel: string;
    possibleConditions: string[];
    recommendations: string[];
    vetRequired: boolean;
    warningSignsToWatch?: string[];
    personalizedMessage?: string;
}
export declare const SymptomCheckSchema: import("mongoose").Schema<SymptomCheck, import("mongoose").Model<SymptomCheck, any, any, any, Document<unknown, any, SymptomCheck, any, {}> & SymptomCheck & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SymptomCheck, Document<unknown, {}, import("mongoose").FlatRecord<SymptomCheck>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SymptomCheck> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
