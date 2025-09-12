import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class HealthRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  veterinarian: string;

  @Prop()
  clinic: string;

  @Prop([String])
  attachments: string[];

  @Prop()
  nextDueDate: Date;

  @Prop()
  weight: number;

  @Prop()
  temperature: number;

  @Prop()
  heartRate: number;

  @Prop()
  cost: number;

  @Prop()
  notes: string;

  @Prop({ default: false })
  isReminder: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const HealthRecordSchema = SchemaFactory.createForClass(HealthRecord);

// Performance indexes
HealthRecordSchema.index({ petId: 1, isActive: 1 });
HealthRecordSchema.index({ petId: 1, type: 1, isActive: 1 });
HealthRecordSchema.index({ petId: 1, date: -1 });
HealthRecordSchema.index({ nextDueDate: 1, isActive: 1 });
HealthRecordSchema.index({ petId: 1, nextDueDate: 1 });