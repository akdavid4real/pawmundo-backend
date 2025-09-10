import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MedicationDocument = Medication & Document;

@Schema({ timestamps: true })
export class Medication {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ required: true, enum: ['daily', 'weekly', 'monthly', 'as-needed'] })
  frequency: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  instructions?: string;

  @Prop()
  veterinarian?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isCompleted: boolean;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);