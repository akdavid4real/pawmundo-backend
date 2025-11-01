import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type NotificationPreferenceDocument = NotificationPreference & Document;

@Schema({ timestamps: true })
export class NotificationPreference {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: true })
  globalEnabled: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  petSettings: Record<string, {
    appointments: boolean;
    medications: boolean;
    vaccinations: boolean;
    checkups: boolean;
    healthAlerts: boolean;
    weightChanges: boolean;
  }>;

  @Prop({ default: true })
  emailNotifications: boolean;

  @Prop({ default: true })
  pushNotifications: boolean;

  @Prop({ default: 24 })
  reminderHoursBefore: number;
}

export const NotificationPreferenceSchema = SchemaFactory.createForClass(NotificationPreference);
