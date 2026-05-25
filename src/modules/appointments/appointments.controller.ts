import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

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
