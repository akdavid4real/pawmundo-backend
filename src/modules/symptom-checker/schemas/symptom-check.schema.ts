import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SymptomCheck extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  petName: string;

  @Prop({ type: [String], required: true })
  symptoms: string[];

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  severity: string;

  @Prop()
  additionalInfo?: string;

  @Prop({ required: true })
  urgencyLevel: string;

  @Prop({ type: [String], required: true })
  possibleConditions: string[];

  @Prop({ type: [String], required: true })
  recommendations: string[];

  @Prop({ required: true })
  vetRequired: boolean;

  @Prop({ type: [String] })
  warningSignsToWatch?: string[];

  @Prop()
  personalizedMessage?: string;
}

export const SymptomCheckSchema = SchemaFactory.createForClass(SymptomCheck);
