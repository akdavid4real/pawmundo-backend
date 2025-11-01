import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req, @Query('petId') petId?: string) {
    return this.notificationsService.findAllByUser(req.user.userId, petId);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true };
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Patch('preferences')
  async updatePreferences(@Request() req, @Body() updateDto: UpdatePreferenceDto) {
    try {
      return await this.notificationsService.updatePreferences(req.user.userId, updateDto);
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }
}
