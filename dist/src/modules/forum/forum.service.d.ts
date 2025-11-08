import { Model } from 'mongoose';
import { ForumPost } from './schemas/forum-post.schema';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
export declare class ForumService {
    private forumPostModel;
    constructor(forumPostModel: Model<ForumPost>);
    create(createForumPostDto: CreateForumPostDto, authorId: string): Promise<ForumPost>;
    findAll(category?: string, page?: number, limit?: number): Promise<{
        posts: ForumPost[];
        total: number;
    }>;
    findById(id: string): Promise<ForumPost>;
    toggleLike(postId: string, userId: string): Promise<ForumPost>;
    addReply(postId: string, createReplyDto: CreateReplyDto, authorId: string): Promise<ForumPost>;
    update(id: string, updateForumPostDto: UpdateForumPostDto, userId: string): Promise<ForumPost>;
    search(query: string, category?: string, page?: number, limit?: number): Promise<{
        posts: ForumPost[];
        total: number;
    }>;
    getPopularPosts(limit?: number): Promise<ForumPost[]>;
    getUserPosts(userId: string, page?: number, limit?: number): Promise<{
        posts: ForumPost[];
        total: number;
    }>;
    delete(id: string, userId: string): Promise<void>;
}
