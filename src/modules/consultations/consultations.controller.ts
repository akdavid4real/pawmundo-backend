import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('consultations')
@UseGuards(JwtAuthGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  create(@Request() req, @Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(req.user.userId, createConsultationDto);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: string) {
    if (status) {
      return this.consultationsService.findByStatus(req.user.userId, status);
    }
    return this.consultationsService.findAll(req.user.userId);
  }

  @Get('upcoming')
  getUpcoming(@Request() req) {
    return this.consultationsService.getUpcoming(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.consultationsService.findById(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(id, req.user.userId, updateConsultationDto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.consultationsService.cancel(id, req.user.userId);
  }

  @Patch(':id/start')
  startConsultation(@Param('id') id: string, @Request() req, @Body('meetingLink') meetingLink: string) {
    return this.consultationsService.startConsultation(id, req.user.userId, meetingLink);
  }

  @Patch(':id/complete')
  completeConsultation(
    @Param('id') id: string, 
    @Request() req, 
    @Body('notes') notes: string,
    @Body('prescription') prescription?: string
  ) {
    return this.consultationsService.completeConsultation(id, req.user.userId, notes, prescription);
  }
}