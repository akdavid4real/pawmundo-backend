import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InsuranceDocument = Insurance & Document;

@Schema({ timestamps: true })
export class Insurance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: Types.ObjectId;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  policyNumber: string;

  @Prop({ required: true })
  planType: string;

  @Prop({ required: true })
  monthlyPremium: number;

  @Prop({ required: true })
  deductible: number;

  @Prop({ required: true })
  coverageLimit: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ 
    type: String, 
    enum: ['active', 'expired', 'cancelled', 'pending'], 
    default: 'active' 
  })
  status: string;

  @Prop()
  notes?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);