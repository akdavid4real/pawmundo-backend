import { Document, Types } from 'mongoose';
export declare class Activity extends Document {
    petId: Types.ObjectId;
    type: string;
    date: Date;
    duration?: number;
    distance?: number;
    foodAmount?: number;
    waterAmount?: number;
    notes?: string;
    isActive: boolean;
}
export declare const ActivitySchema: import("mongoose").Schema<Activity, import("mongoose").Model<Activity, any, any, any, Document<unknown, any, Activity, any, {}> & Activity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Activity, Document<unknown, {}, import("mongoose").FlatRecord<Activity>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Activity> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
