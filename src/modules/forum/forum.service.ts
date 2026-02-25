import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ForumCategory, Prisma } from '@prisma/client';

@Injectable()
export class ForumService {
  constructor(private prisma: PrismaService) { }

  async create(createForumPostDto: CreateForumPostDto, authorId: string) {
    const data: Prisma.ForumPostUncheckedCreateInput = {
      title: createForumPostDto.title,
      content: createForumPostDto.content,
      category: createForumPostDto.category as ForumCategory,
      authorId,
    };
    return this.prisma.forumPost.create({ data });
  }

  async findAll(category?: string, page = 1, limit = 10) {
    const where: Prisma.ForumPostWhereInput = { isActive: true };
    if (category) where.category = category as ForumCategory;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.forumPost.findMany({
        where,
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
          replies: {
            include: { author: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'asc' },
          },
          likes: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.forumPost.count({ where }),
    ]);

    return { posts, total };
  }

  async findById(id: string) {
    // Increment view count
    const post = await this.prisma.forumPost.update({
      where: { id, isActive: true },
      data: { viewCount: { increment: 1 } },
      include: {
        author: { select: { firstName: true, lastName: true, email: true } },
        replies: {
          include: { author: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }
    return post;
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.prisma.forumPost.findUnique({
      where: { id: postId },
      include: { likes: true },
    });

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
    }

    const existingLike = post.likes.find(like => like.userId === userId);

    if (existingLike) {
      await this.prisma.forumLike.delete({ where: { id: existingLike.id } });
    } else {
      await this.prisma.forumLike.create({
        data: { postId, userId },
      });
    }

    return this.prisma.forumPost.findUnique({
      where: { id: postId },
      include: { likes: true },
    });
  }

  async addReply(postId: string, createReplyDto: CreateReplyDto, authorId: string) {
    const post = await this.prisma.forumPost.findUnique({ where: { id: postId } });

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${postId}' does not exist or has been deleted`);
    }

    await this.prisma.forumReply.create({
      data: {
        content: createReplyDto.content,
        authorId,
        postId,
      },
    });

    return this.prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        replies: {
          include: { author: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
        likes: true,
      },
    });
  }

  async update(id: string, updateForumPostDto: UpdateForumPostDto, userId: string) {
    const post = await this.prisma.forumPost.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException(`You don't have permission to edit this forum post. You can only edit posts that you created.`);
    }

    const data: Prisma.ForumPostUncheckedUpdateInput = {
      ...(updateForumPostDto.title ? { title: updateForumPostDto.title } : {}),
      ...(updateForumPostDto.content ? { content: updateForumPostDto.content } : {}),
      ...(updateForumPostDto.category ? { category: updateForumPostDto.category as ForumCategory } : {}),
    };

    return this.prisma.forumPost.update({
      where: { id },
      data,
    });
  }

  async search(query: string, category?: string, page = 1, limit = 10) {
    const where: Prisma.ForumPostWhereInput = {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ],
    };
    if (category) where.category = category as ForumCategory;

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.forumPost.findMany({
        where,
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
          replies: {
            include: { author: { select: { firstName: true, lastName: true, email: true } } },
          },
          likes: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.forumPost.count({ where }),
    ]);

    return { posts, total };
  }

  async getPopularPosts(limit = 10) {
    return this.prisma.forumPost.findMany({
      where: { isActive: true },
      include: {
        author: { select: { firstName: true, lastName: true, email: true } },
        likes: true,
      },
      orderBy: [{ viewCount: 'desc' }],
      take: limit,
    });
  }

  async getUserPosts(userId: string, page = 1, limit = 10) {
    const where = { authorId: userId, isActive: true };
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.forumPost.findMany({
        where,
        include: {
          author: { select: { firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.forumPost.count({ where }),
    ]);

    return { posts, total };
  }

  async delete(id: string, userId: string) {
    const post = await this.prisma.forumPost.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException(`Forum post with ID '${id}' does not exist or has been deleted`);
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException(`You don't have permission to delete this forum post. You can only delete posts that you created.`);
    }

    await this.prisma.forumPost.update({
      where: { id },
      data: { isActive: false },
    });
  }
}