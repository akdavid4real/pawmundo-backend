import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HealthRemindersService } from './health-reminders.service';

@ApiTags('health-reminders')
@ApiBearerAuth()
@Controller('health-reminders')
@UseGuards(JwtAuthGuard)
export class HealthRemindersController {
  constructor(private readonly healthRemindersService: HealthRemindersService) { }

  @ApiOperation({ summary: 'Get all reminders for user' })
  @ApiResponse({ status: 200, description: 'User health reminders' })
  @Get()
  async getReminders(@Request() req) {
    return this.healthRemindersService.getRemindersForUser(req.user.id);
  }

  @ApiOperation({ summary: 'Create vaccination reminders for pet' })
  @ApiResponse({ status: 201, description: 'Vaccination reminders created' })
  @Post('pet/:petId/vaccinations')
  async createVaccinationReminders(@Param('petId') petId: string, @Request() req) {
    return this.healthRemindersService.createVaccinationReminders(petId, req.user.id);
  }
}