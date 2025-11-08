import { ForumService } from './forum.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
export declare class ForumController {
    private readonly forumService;
    constructor(forumService: ForumService);
    create(req: any, createForumPostDto: CreateForumPostDto): Promise<import("./schemas/forum-post.schema").ForumPost>;
    findAll(category?: string, page?: string, limit?: string): Promise<{
        posts: import("./schemas/forum-post.schema").ForumPost[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./schemas/forum-post.schema").ForumPost>;
    toggleLike(id: string, req: any): Promise<import("./schemas/forum-post.schema").ForumPost>;
    addReply(id: string, createReplyDto: CreateReplyDto, req: any): Promise<import("./schemas/forum-post.schema").ForumPost>;
    remove(id: string, req: any): Promise<void>;
}
