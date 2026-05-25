import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ConsultationsGateway } from './consultations.gateway';


@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)

export class ConsultationsController {
  constructor(
    private readonly consultationsService: ConsultationsService,
    private readonly consultationsGateway: ConsultationsGateway,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create a new consultation request',
    description: `
      Request a virtual consultation with a veterinarian.
      
      **Process:**
      1. Submit consultation request with pet details
      2. Request enters vet queue with 'pending' status
      3. Available vets can see and accept the request
      4. You'll be notified when a vet accepts
      
      **Required Information:**
      - Pet ID (must be your pet)
      - Scheduled date/time
      - Reason for consultation
      
      **Optional Information:**
      - Symptoms description
      - Consultation type (video/audio/chat)
      - Expected duration
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Consultation created successfully',
    schema: {
      example: {
        _id: '507f1f77bcf86cd799439012',
        userId: '507f1f77bcf86cd799439010',
        petId: '507f1f77bcf86cd799439011',
        status: 'pending',
        scheduledDate: '2024-12-25T10:00:00.000Z',
        reason: 'Annual checkup',
        symptoms: 'Coughing and sneezing',
        consultationType: 'video',
        duration: 30,
        isActive: true,
        createdAt: '2024-01-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(req.user.id, createConsultationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all consultations for the authenticated user' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], description: 'Filter by consultation status' })
  @ApiResponse({ status: 200, description: 'List of consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req, @Query('status') status?: string) {
    if (status) {
      return this.consultationsService.findByStatus(req.user.id, status);
    }
    return this.consultationsService.findAll(req.user.id);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming consultations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Upcoming consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUpcoming(@Request() req) {
    return this.consultationsService.getUpcoming(req.user.id);
  }



  @Get('vet/queue')
  @Roles('vet')
  @ApiOperation({ summary: 'Get pending consultations in the vet queue (Vet only)' })
  @ApiResponse({ status: 200, description: 'Queue retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetQueue(@Request() req) {
    return this.consultationsService.getVetQueue(req.user.id);
  }

  @Get('vet/active')
  @Roles('vet')
  @ApiOperation({ summary: 'Get active consultations assigned to the vet (Vet only)' })
  @ApiResponse({ status: 200, description: 'Active consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetActive(@Request() req) {
    return this.consultationsService.getVetActive(req.user.id);
  }

  @Get('vet/history')
  @Roles('vet')
  @ApiOperation({ summary: 'Get completed consultation history for the vet (Vet only)' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetHistory(@Request() req) {
    return this.consultationsService.getVetHistory(req.user.id);
  }

  @Get('vet/:id')
  @Roles('vet')
  @ApiOperation({ summary: 'Get any consultation by ID (Vet only)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  findOneForVet(@Param('id') id: string, @Request() req) {
    return this.consultationsService.findByIdForVet(id, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.consultationsService.findById(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update consultation details' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Request() req, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(id, req.user.id, updateConsultationDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel consultation in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.consultationsService.cancel(id, req.user.id);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start a consultation session with meeting link' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        meetingLink: { type: 'string', example: 'https://meet.example.com/room/123' }
      },
      required: ['meetingLink']
    }
  })
  @ApiResponse({ status: 200, description: 'Consultation started successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 400, description: 'Cannot start consultation in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  startConsultation(@Param('id') id: string, @Request() req, @Body('meetingLink') meetingLink: string) {
    return this.consultationsService.startConsultation(id, req.user.id, meetingLink);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a consultation with notes and prescription' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        notes: { type: 'string', example: 'Patient responded well to treatment' },
        prescription: { type: 'string', example: 'Amoxicillin 500mg twice daily for 7 days' }
      },
      required: ['notes']
    }
  })
  @ApiResponse({ status: 200, description: 'Consultation completed successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 400, description: 'Cannot complete consultation in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  completeConsultation(
    @Param('id') id: string,
    @Request() req,
    @Body('notes') notes: string,
    @Body('prescription') prescription?: string
  ) {
    return this.consultationsService.completeConsultation(id, req.user.id, notes, prescription);
  }

  @Post(':id/accept')
  @Roles('vet')
  @ApiOperation({ summary: 'Accept a consultation from the queue (Vet only)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation accepted successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 409, description: 'Consultation already assigned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  acceptConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.acceptConsultation(id, req.user.id);
  }

  @Post(':id/release')
  @Roles('vet')
  @ApiOperation({ summary: 'Release a consultation back to the queue (Vet only)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation released successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not assigned to this vet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  releaseConsultation(@Param('id') id: string, @Request() req) {
    return this.consultationsService.releaseConsultation(id, req.user.id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({ schema: { properties: { message: { type: 'string', example: 'Hello, how can I help you?' } } } })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendMessage(@Param('id') id: string, @Request() req, @Body('message') message: string) {
    const isVet = req.user.role === 'vet';
    const consultation = await this.consultationsService.sendMessage(id, req.user.id, message, isVet);
    this.consultationsGateway.notifyConsultationMessage(id, consultation);
    return consultation;
  }

  @Get(':id/assignment-status')
  @Roles('vet')
  @ApiOperation({ summary: 'Check if consultation is assigned to the current vet (Vet only)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Assignment status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  checkAssignmentStatus(@Param('id') id: string, @Request() req) {
    return this.consultationsService.isConsultationAssignedToVet(id, req.user.id);
  }

  @Put(':id/messages/read')
  @ApiOperation({ summary: 'Mark messages as read in a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({ schema: { properties: { messageIds: { type: 'array', items: { type: 'string' } } } } })
  @ApiResponse({ status: 200, description: 'Messages marked as read' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markMessagesAsRead(
    @Param('id') id: string,
    @Request() req,
    @Body('messageIds') messageIds?: string[],
  ) {
    const consultation = await this.consultationsService.markMessagesAsRead(id, req.user.id, messageIds);
    this.consultationsGateway.notifyConsultationUpdated(id, { consultation });
    return consultation;
  }
}
