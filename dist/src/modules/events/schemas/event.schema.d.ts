import { Document, Types } from 'mongoose';
export type EventDocument = Event & Document;
export declare class Event {
    userId: Types.ObjectId;
    petId?: Types.ObjectId;
    title: string;
    description: string;
    eventDate: Date;
    eventTime?: string;
    category: string;
    status: string;
    location?: string;
    notes?: string;
    isRecurring: boolean;
    recurringType?: string;
    isActive: boolean;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, Document<unknown, any, Event, any, {}> & Event & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Event> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
