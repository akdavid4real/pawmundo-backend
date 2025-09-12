import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Pet extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  species: string;

  @Prop({ required: true })
  breed: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop()
  weight: number;

  @Prop()
  color: string;

  @Prop()
  microchipId: string;

  @Prop()
  profileImage: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  medicalNotes: string;

  @Prop()
  emergencyContactName: string;

  @Prop()
  emergencyContactPhone: string;

  @Prop({ default: 'healthy', enum: ['healthy', 'sick', 'recovering', 'chronic'] })
  healthStatus: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const PetSchema = SchemaFactory.createForClass(Pet);

// Performance indexes
PetSchema.index({ ownerId: 1, isActive: 1 });
PetSchema.index({ ownerId: 1, species: 1, isActive: 1 });
PetSchema.index({ ownerId: 1, healthStatus: 1, isActive: 1 });