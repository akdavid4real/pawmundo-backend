import { Document, Types } from 'mongoose';
export declare class ForumPost extends Document {
    title: string;
    content: string;
    category: string;
    authorId: Types.ObjectId;
    likes: Types.ObjectId[];
    viewCount: number;
    isActive: boolean;
    replies: Array<{
        content: string;
        authorId: Types.ObjectId;
        createdAt: Date;
    }>;
}
export declare const ForumPostSchema: import("mongoose").Schema<ForumPost, import("mongoose").Model<ForumPost, any, any, any, Document<unknown, any, ForumPost, any, {}> & ForumPost & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ForumPost, Document<unknown, {}, import("mongoose").FlatRecord<ForumPost>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ForumPost> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
