import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet' })
  petId?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop()
  eventTime?: string;

  @Prop({ required: true, enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] })
  category: string;

  @Prop({ default: 'scheduled', enum: ['scheduled', 'completed', 'cancelled'] })
  status: string;

  @Prop()
  location?: string;

  @Prop()
  notes?: string;

  @Prop({ default: false })
  isRecurring: boolean;

  @Prop({ enum: ['daily', 'weekly', 'monthly', 'yearly'] })
  recurringType?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);