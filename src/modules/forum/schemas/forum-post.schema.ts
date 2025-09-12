import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ForumPost extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: ['general', 'health', 'training', 'nutrition', 'behavior'] })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{
    content: { type: String, required: true },
    authorId: { type: Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }])
  replies: Array<{
    content: string;
    authorId: Types.ObjectId;
    createdAt: Date;
  }>;
}

export const ForumPostSchema = SchemaFactory.createForClass(ForumPost);

ForumPostSchema.index({ category: 1, isActive: 1, createdAt: -1 });
ForumPostSchema.index({ authorId: 1, isActive: 1 });