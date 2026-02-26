import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HealthRecordsService } from './health-records.service';
import { CreateHealthRecordDto } from './dto/create-health-record.dto';
import { UpdateHealthRecordDto } from './dto/update-health-record.dto';

@ApiTags('health-records')
@ApiBearerAuth()
@Controller('health-records')
@UseGuards(JwtAuthGuard)
export class HealthRecordsController {
  constructor(private readonly healthRecordsService: HealthRecordsService) { }

  @ApiOperation({ summary: 'Create health record' })
  @ApiResponse({ status: 201, description: 'Health record created successfully' })
  @Post()
  async create(@Request() req, @Body() createDto: CreateHealthRecordDto) {
    const healthRecordData = {
      ...createDto,
      petId: createDto.petId,
      date: new Date(createDto.date),
      nextDueDate: createDto.nextDueDate ? new Date(createDto.nextDueDate) : undefined,
    };
    return this.healthRecordsService.create(req.user.id, healthRecordData);
  }

  @ApiOperation({ summary: 'Get health records by pet' })
  @ApiResponse({ status: 200, description: 'List of pet health records' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by record type' })
  @Get('pet/:petId')
  async findByPet(@Param('petId') petId: string, @Query('type') type: string, @Request() req) {
    return this.healthRecordsService.findByPet(petId, req.user.id, type);
  }

  @ApiOperation({ summary: 'Get upcoming reminders' })
  @ApiResponse({ status: 200, description: 'List of upcoming health reminders' })
  @Get('reminders/upcoming')
  async getUpcomingReminders(@Request() req) {
    return this.healthRecordsService.getUpcomingReminders(req.user.id);
  }

  @ApiOperation({ summary: 'Get vaccination history' })
  @ApiResponse({ status: 200, description: 'Vaccination records for pet' })
  @Get('pet/:petId/vaccinations')
  async getVaccinations(@Param('petId') petId: string, @Request() req) {
    return this.healthRecordsService.getVaccinations(petId, req.user.id);
  }

  @ApiOperation({ summary: 'Get health summary for pet' })
  @ApiResponse({ status: 200, description: 'Health summary statistics' })
  @Get('pet/:petId/summary')
  async getHealthSummary(@Param('petId') petId: string, @Request() req) {
    return this.healthRecordsService.getHealthSummary(petId, req.user.id);
  }

  @ApiOperation({ summary: 'Get health record by ID' })
  @ApiResponse({ status: 200, description: 'Health record details' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.healthRecordsService.findById(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update health record' })
  @ApiResponse({ status: 200, description: 'Health record updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateHealthRecordDto, @Request() req) {
    const healthRecordData: any = { ...updateDto };
    if (updateDto.date) {
      healthRecordData.date = new Date(updateDto.date);
    }
    if (updateDto.nextDueDate) {
      healthRecordData.nextDueDate = new Date(updateDto.nextDueDate);
    }
    return this.healthRecordsService.update(id, req.user.id, healthRecordData);
  }

  @ApiOperation({ summary: 'Delete health record' })
  @ApiResponse({ status: 200, description: 'Health record deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.healthRecordsService.delete(id, req.user.id);
  }

  @ApiOperation({ summary: 'Get overdue reminders' })
  @ApiResponse({ status: 200, description: 'List of overdue health reminders' })
  @Get('reminders/overdue')
  async getOverdueReminders(@Request() req) {
    return this.healthRecordsService.getOverdueReminders(req.user.id);
  }

  @ApiOperation({ summary: 'Add attachment to health record' })
  @ApiResponse({ status: 200, description: 'Attachment added successfully' })
  @Post(':id/attachments')
  async addAttachment(@Param('id') id: string, @Body('url') url: string, @Request() req) {
    return this.healthRecordsService.addAttachment(id, req.user.id, url);
  }

  @ApiOperation({ summary: 'Remove attachment from health record' })
  @ApiResponse({ status: 200, description: 'Attachment removed successfully' })
  @Delete(':id/attachments')
  async removeAttachment(@Param('id') id: string, @Body('url') url: string, @Request() req) {
    return this.healthRecordsService.removeAttachment(id, req.user.id, url);
  }

  @ApiOperation({ summary: 'Get health records by date range' })
  @ApiResponse({ status: 200, description: 'Health records within date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @Get('pet/:petId/date-range')
  async getRecordsByDateRange(
    @Param('petId') petId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req,
  ) {
    return this.healthRecordsService.getRecordsByDateRange(
      petId,
      req.user.id,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiOperation({ summary: 'Get health analytics for user' })
  @ApiResponse({ status: 200, description: 'Health analytics and statistics' })
  @Get('analytics')
  async getHealthAnalytics(@Request() req) {
    return this.healthRecordsService.getHealthAnalytics(req.user.id);
  }
}