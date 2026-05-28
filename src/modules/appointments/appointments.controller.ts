import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully' })
  @Post()
  async create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, createAppointmentDto);
  }

  @ApiOperation({ summary: 'Get upcoming appointments' })
  @ApiResponse({ status: 200, description: 'List of upcoming appointments' })
  @Get('upcoming')
  async findUpcoming(@Request() req) {
    return this.appointmentsService.findUpcoming(req.user.id);
  }

  @ApiOperation({ summary: 'Get all user appointments' })
  @ApiResponse({ status: 200, description: 'List of user appointments' })
  @Get('my-appointments')
  async findMyAppointments(@Request() req) {
    return this.appointmentsService.findByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get clinic appointments for clinic admin' })
  @Get('clinic')
  @UseGuards(RolesGuard)
  @Roles('clinic_admin')
  async findClinicAppointments(@Request() req, @Query() query: {
    status?: AppointmentStatus;
    vetId?: string;
    date?: string;
    patientId?: string;
  }) {
    return this.appointmentsService.findForClinicAdmin(req.user.id, query);
  }

  @ApiOperation({ summary: 'Get clinic appointment detail for clinic admin' })
  @Get('clinic/:id')
  @UseGuards(RolesGuard)
  @Roles('clinic_admin')
  async findClinicAppointment(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOneForClinicAdmin(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update clinic appointment for clinic admin' })
  @Put('clinic/:id')
  @UseGuards(RolesGuard)
  @Roles('clinic_admin')
  async updateClinicAppointment(@Param('id') id: string, @Body() dto: UpdateAppointmentDto, @Request() req) {
    return this.appointmentsService.updateForClinicAdmin(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Update clinic appointment status for clinic admin' })
  @Put('clinic/:id/status')
  @UseGuards(RolesGuard)
  @Roles('clinic_admin')
  async updateClinicAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req,
  ) {
    return this.appointmentsService.transitionForClinicAdmin(id, req.user.id, status);
  }

  @ApiOperation({ summary: 'Get assigned vet appointments' })
  @Get('vet')
  @UseGuards(RolesGuard)
  @Roles('vet')
  async findVetAppointments(@Request() req) {
    return this.appointmentsService.findForVet(req.user.id);
  }

  @ApiOperation({ summary: 'Get assigned vet appointment detail' })
  @Get('vet/:id')
  @UseGuards(RolesGuard)
  @Roles('vet')
  async findVetAppointment(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOneForVet(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update assigned vet appointment status' })
  @Put('vet/:id/status')
  @UseGuards(RolesGuard)
  @Roles('vet')
  async updateVetAppointmentStatus(
    @Param('id') id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req,
  ) {
    return this.appointmentsService.transitionForVet(id, req.user.id, status);
  }

  @ApiOperation({ summary: 'Get all user appointments' })
  @ApiResponse({ status: 200, description: 'List of user appointments' })
  @Get()
  async findAllForCurrentUser(@Request() req) {
    return this.appointmentsService.findByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findById(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @Request() req) {
    return this.appointmentsService.update(id, req.user.id, updateAppointmentDto);
  }

  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({ status: 200, description: 'Appointment cancelled successfully' })
  @Put(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.cancel(id, req.user.id);
  }

  @ApiOperation({ summary: 'Delete appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.delete(id, req.user.id);
  }
}
