import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationNoteDocument = ConsultationNote & Document;

@Schema({ timestamps: true })
export class ConsultationNote {
  @Prop({ type: Types.ObjectId, ref: 'Consultation', required: true })
  consultationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vetId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  isPrivate: boolean;

  @Prop({ enum: ['observation', 'diagnosis', 'treatment', 'followup', 'other'], default: 'observation' })
  noteType: string;
}

export const ConsultationNoteSchema = SchemaFactory.createForClass(ConsultationNote);
ConsultationNoteSchema.index({ consultationId: 1, vetId: 1 });
