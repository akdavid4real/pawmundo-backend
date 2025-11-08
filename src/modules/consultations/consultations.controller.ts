import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Consultations')
@ApiBearerAuth()
@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consultation request' })
  @ApiResponse({ status: 201, description: 'Consultation created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Request() req, @Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(req.user.userId, createConsultationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all consultations for the authenticated user' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'], description: 'Filter by consultation status' })
  @ApiResponse({ status: 200, description: 'List of consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req, @Query('status') status?: string) {
    if (status) {
      return this.consultationsService.findByStatus(req.user.userId, status);
    }
    return this.consultationsService.findAll(req.user.userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming consultations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Upcoming consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getUpcoming(@Request() req) {
    return this.consultationsService.getUpcoming(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.consultationsService.findById(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update consultation details' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation updated successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Request() req, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(id, req.user.userId, updateConsultationDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Consultation cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 400, description: 'Cannot cancel consultation in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  cancel(@Param('id') id: string, @Request() req) {
    return this.consultationsService.cancel(id, req.user.userId);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Start a consultation session with meeting link' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({ schema: { properties: { meetingLink: { type: 'string', example: 'https://meet.example.com/abc123' } } } })
  @ApiResponse({ status: 200, description: 'Consultation started successfully' })
  @ApiResponse({ status: 404, description: 'Consultation not found' })
  @ApiResponse({ status: 400, description: 'Cannot start consultation in current status' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  startConsultation(@Param('id') id: string, @Request() req, @Body('meetingLink') meetingLink: string) {
    return this.consultationsService.startConsultation(id, req.user.userId, meetingLink);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete a consultation with notes and optional prescription' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiBody({ 
    schema: { 
      properties: { 
        notes: { type: 'string', example: 'Patient responded well to treatment' },
        prescription: { type: 'string', example: 'Amoxicillin 500mg twice daily for 7 days', required: false }
      } 
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
    return this.consultationsService.completeConsultation(id, req.user.userId, notes, prescription);
  }

  @Get('vet/queue')
  @Roles('vet')
  @ApiOperation({ summary: 'Get pending consultations in the vet queue (Vet only)' })
  @ApiResponse({ status: 200, description: 'Queue retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetQueue() {
    return this.consultationsService.getVetQueue();
  }

  @Get('vet/active')
  @Roles('vet')
  @ApiOperation({ summary: 'Get active consultations assigned to the vet (Vet only)' })
  @ApiResponse({ status: 200, description: 'Active consultations retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetActive(@Request() req) {
    return this.consultationsService.getVetActive(req.user.userId);
  }

  @Get('vet/history')
  @Roles('vet')
  @ApiOperation({ summary: 'Get completed consultation history for the vet (Vet only)' })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Vet role required' })
  getVetHistory(@Request() req) {
    return this.consultationsService.getVetHistory(req.user.userId);
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
    return this.consultationsService.acceptConsultation(id, req.user.userId);
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
    return this.consultationsService.releaseConsultation(id, req.user.userId);
  }
}