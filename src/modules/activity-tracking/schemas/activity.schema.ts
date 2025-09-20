import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true, enum: ['walk', 'play', 'feeding', 'water', 'exercise', 'other'] })
  type: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  duration?: number; // in minutes

  @Prop()
  distance?: number; // in km for walks

  @Prop()
  foodAmount?: number; // in grams

  @Prop()
  waterAmount?: number; // in ml

  @Prop()
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.index({ petId: 1, date: -1 });
ActivitySchema.index({ petId: 1, type: 1, date: -1 });