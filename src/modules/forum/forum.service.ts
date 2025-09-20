import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForumPost } from './schemas/forum-post.schema';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(ForumPost.name) private forumPostModel: Model<ForumPost>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto, authorId: string): Promise<ForumPost> {
    const post = new this.forumPostModel({
      ...createForumPostDto,
      authorId: new Types.ObjectId(authorId),
    });
    return post.save();
  }

  async findAll(category?: string, page = 1, limit = 10): Promise<{ posts: ForumPost[]; total: number }> {
    const filter: any = { isActive: true };
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.forumPostModel
        .find(filter)
        .populate('authorId', 'name email')
        .populate('replies.authorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.forumPostModel.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async findById(id: string): Promise<ForumPost> {
    const post = await this.forumPostModel
      .findOneAndUpdate(
        { _id: id, isActive: true },
        { $inc: { viewCount: 1 } },
        { new: true }
      )
      .populate('authorId', 'name email')
      .populate('replies.authorId', 'name email')
      .exec();

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }
    return post;
  }

  async toggleLike(postId: string, userId: string): Promise<ForumPost> {
    const userObjectId = new Types.ObjectId(userId);
    const post = await this.forumPostModel.findById(postId);
    
    if (!post) {
      throw new NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
    }

    const likeIndex = post.likes.findIndex(id => id.equals(userObjectId));
    
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userObjectId);
    }

    return post.save();
  }

  async addReply(postId: string, createReplyDto: CreateReplyDto, authorId: string): Promise<ForumPost> {
    const post = await this.forumPostModel.findById(postId);
    
    if (!post) {
      throw new NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
    }

    post.replies.push({
      content: createReplyDto.content,
      authorId: new Types.ObjectId(authorId),
      createdAt: new Date(),
    });

    return post.save();
  }

  async update(id: string, updateForumPostDto: UpdateForumPostDto, userId: string): Promise<ForumPost> {
    const post = await this.forumPostModel.findById(id);
    
    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }

    if (!post.authorId.equals(new Types.ObjectId(userId))) {
      throw new ForbiddenException(`You don't have permission to edit this forum post. You can only edit posts that you created.`);
    }

    Object.assign(post, updateForumPostDto);
    return post.save();
  }

  async search(query: string, category?: string, page = 1, limit = 10): Promise<{ posts: ForumPost[]; total: number }> {
    const filter: any = { 
      isActive: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };
    
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.forumPostModel
        .find(filter)
        .populate('authorId', 'name email')
        .populate('replies.authorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.forumPostModel.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async getPopularPosts(limit = 10): Promise<ForumPost[]> {
    return this.forumPostModel
      .find({ isActive: true })
      .populate('authorId', 'name email')
      .sort({ likes: -1, viewCount: -1 })
      .limit(limit)
      .exec();
  }

  async getUserPosts(userId: string, page = 1, limit = 10): Promise<{ posts: ForumPost[]; total: number }> {
    const filter = { authorId: new Types.ObjectId(userId), isActive: true };
    const skip = (page - 1) * limit;
    
    const [posts, total] = await Promise.all([
      this.forumPostModel
        .find(filter)
        .populate('authorId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.forumPostModel.countDocuments(filter),
    ]);

    return { posts, total };
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.forumPostModel.findById(id);
    
    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }

    if (!post.authorId.equals(new Types.ObjectId(userId))) {
      throw new ForbiddenException(`You don't have permission to delete this forum post. You can only delete posts that you created.`);
    }

    post.isActive = false;
    await post.save();
  }
}