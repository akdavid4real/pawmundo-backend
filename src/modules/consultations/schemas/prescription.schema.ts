import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PrescriptionDocument = Prescription & Document;

@Schema({ timestamps: true })
export class Prescription {
  @Prop({ type: Types.ObjectId, ref: 'Consultation', required: true })
  consultationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  vetId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  petOwnerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  medicationName: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  duration: string;

  @Prop()
  instructions?: string;

  @Prop()
  warnings?: string;

  @Prop()
  notes?: string;

  @Prop()
  pdfUrl?: string;

  @Prop({ default: 'active', enum: ['active', 'completed', 'cancelled'] })
  status: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
PrescriptionSchema.index({ consultationId: 1 });
PrescriptionSchema.index({ petOwnerId: 1, status: 1 });
