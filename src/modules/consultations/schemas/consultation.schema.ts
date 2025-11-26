import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ConsultationDocument = Consultation & Document;

@Schema({ timestamps: true })
export class Consultation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedVet?: Types.ObjectId;

  @Prop()
  veterinarianName?: string;

  @Prop({ required: true, enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ default: 30 })
  duration: number;

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

  @Prop({ default: 'video', enum: ['video', 'audio', 'chat'] })
  consultationType: string;

  @Prop()
  meetingLink?: string;

  @Prop()
  meetingId?: string;

  @Prop({ default: 0 })
  cost: number;

  @Prop({ default: 'pending', enum: ['pending', 'paid', 'refunded'] })
  paymentStatus: string;

  @Prop({ default: 0 })
  unreadCount: number;

  @Prop()
  lastMessageAt?: Date;

  @Prop({ 
    type: [{
      id: { type: String, required: true },
      text: { type: String, required: true },
      sender: { type: String, enum: ['user', 'doctor'], required: true },
      timestamp: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false }
    }],
    default: []
  })
  messages: Array<{
    id: string;
    text: string;
    sender: 'user' | 'doctor';
    timestamp: Date;
    isRead: boolean;
  }>;

  @Prop({ default: true })
  isActive: boolean;
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);
ConsultationSchema.index({ assignedVet: 1, status: 1 });
ConsultationSchema.index({ status: 1, scheduledDate: 1 });