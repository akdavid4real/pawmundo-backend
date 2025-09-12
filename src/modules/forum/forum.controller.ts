import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForumService } from './forum.service';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { CreateReplyDto } from './dto/create-reply.dto';

@ApiTags('forum')
@ApiBearerAuth()
@Controller('forum')
@UseGuards(JwtAuthGuard)
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @ApiOperation({ summary: 'Create a new forum post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @Post()
  async create(@Request() req, @Body() createForumPostDto: CreateForumPostDto) {
    return this.forumService.create(createForumPostDto, req.user._id);
  }

  @ApiOperation({ summary: 'Get all forum posts' })
  @ApiResponse({ status: 200, description: 'List of forum posts' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.forumService.findAll(category, parseInt(page) || 1, parseInt(limit) || 10);
  }

  @ApiOperation({ summary: 'Get forum post by ID' })
  @ApiResponse({ status: 200, description: 'Forum post details' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.forumService.findById(id);
  }

  @ApiOperation({ summary: 'Toggle like on a forum post' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @Post(':id/like')
  async toggleLike(@Param('id') id: string, @Request() req) {
    return this.forumService.toggleLike(id, req.user._id);
  }

  @ApiOperation({ summary: 'Add reply to a forum post' })
  @ApiResponse({ status: 201, description: 'Reply added successfully' })
  @Post(':id/replies')
  async addReply(@Param('id') id: string, @Body() createReplyDto: CreateReplyDto, @Request() req) {
    return this.forumService.addReply(id, createReplyDto, req.user._id);
  }

  @ApiOperation({ summary: 'Delete forum post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.forumService.delete(id, req.user._id);
  }
}