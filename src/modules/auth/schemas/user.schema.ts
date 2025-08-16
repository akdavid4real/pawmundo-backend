import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: 'user', enum: ['user', 'vet', 'admin'] })
  role: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  profileImage: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpires: Date;

  @Prop()
  lastLogin: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);