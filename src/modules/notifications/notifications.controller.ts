import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the authenticated user' })
  @ApiQuery({ name: 'petId', required: false, description: 'Filter notifications by pet ID' })
  @ApiResponse({ status: 200, description: 'Returns list of notifications, optionally filtered by petId.' })
  async getNotifications(@Request() req, @Query('petId') petId?: string) {
    return this.notificationsService.findAllByUser(req.user.userId, petId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get the count of unread notifications' })
  @ApiResponse({ status: 200, description: 'Returns { count: number }.' })
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read.' })
  @ApiResponse({ status: 404, description: 'Notification not found.' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read. Returns { success: true }.' })
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get notification preferences for the user' })
  @ApiResponse({ status: 200, description: 'Returns notification preference settings.' })
  async getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update notification preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  async updatePreferences(@Request() req, @Body() updateDto: UpdatePreferenceDto) {
    try {
      return await this.notificationsService.updatePreferences(req.user.userId, updateDto);
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  @Post('remove-duplicates')
  @ApiOperation({ summary: 'Remove duplicate notifications for the user' })
  @ApiResponse({ status: 201, description: 'Duplicates removed. Returns { success: true, removed: number }.' })
  async removeDuplicates(@Request() req) {
    const count = await this.notificationsService.removeDuplicates(req.user.userId);
    return { success: true, removed: count };
  }
}
