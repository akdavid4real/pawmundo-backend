import { Document, Types } from 'mongoose';
export type ConsultationNoteDocument = ConsultationNote & Document;
export declare class ConsultationNote {
    consultationId: Types.ObjectId;
    vetId: Types.ObjectId;
    content: string;
    isPrivate: boolean;
    noteType: string;
}
export declare const ConsultationNoteSchema: import("mongoose").Schema<ConsultationNote, import("mongoose").Model<ConsultationNote, any, any, any, Document<unknown, any, ConsultationNote, any, {}> & ConsultationNote & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ConsultationNote, Document<unknown, {}, import("mongoose").FlatRecord<ConsultationNote>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ConsultationNote> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
