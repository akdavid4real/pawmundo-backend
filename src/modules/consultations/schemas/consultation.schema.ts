import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationDocument = Consultation & Document;

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  veterinarianId: string;

  @Prop({ required: true })
  veterinarianName: string;

  @Prop({ required: true, enum: ['scheduled', 'in-progress', 'completed', 'cancelled'] })
  status: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ required: true })
  reason: string;

  @Prop()
  symptoms?: string;

  @Prop()
  notes?: string;

  @Prop()
  prescription?: string;

  @Prop()
  followUpRequired?: boolean;

  @Prop()
  followUpDate?: Date;

  @Prop({ required: true, enum: ['video', 'audio', 'chat'] })
  consultationType: string;

  @Prop()
  meetingLink?: string;

  @Prop()
  meetingId?: string;

  @Prop({ default: 0 })
  cost: number;

  @Prop({ default: 'pending', enum: ['pending', 'paid', 'refunded'] })
  paymentStatus: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);