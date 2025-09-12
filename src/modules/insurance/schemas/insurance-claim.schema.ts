import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InsuranceClaimDocument = InsuranceClaim & Document;

@Schema({ timestamps: true })
export class InsuranceClaim {
  @Prop({ type: Types.ObjectId, ref: 'Insurance', required: true })
  insuranceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  claimAmount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  serviceDate: Date;

  @Prop()
  provider?: string;

  @Prop()
  treatmentType?: string;

  @Prop({ 
    type: String, 
    enum: ['pending', 'approved', 'denied', 'processing'], 
    default: 'pending' 
  })
  status: string;

  @Prop()
  approvedAmount?: number;

  @Prop()
  denialReason?: string;

  @Prop()
  processedDate?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const InsuranceClaimSchema = SchemaFactory.createForClass(InsuranceClaim);