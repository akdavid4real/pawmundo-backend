import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  vetName: string;

  @Prop({ required: true })
  vetClinic: string;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ required: true })
  appointmentTime: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: 'scheduled', enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] })
  status: string;

  @Prop()
  notes?: string;

  @Prop()
  vetPhone?: string;

  @Prop()
  vetEmail?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);