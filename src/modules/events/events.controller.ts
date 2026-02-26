import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @Post()
  async create(@Request() req, @Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(req.user.id, createEventDto);
  }

  @ApiOperation({ summary: 'Get all user events' })
  @ApiResponse({ status: 200, description: 'List of user events' })
  @Get()
  async findMyEvents(@Request() req) {
    return this.eventsService.findByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  @Get('upcoming')
  async findUpcoming(@Request() req) {
    return this.eventsService.findUpcoming(req.user.id);
  }

  @ApiOperation({ summary: 'Get events by category' })
  @ApiResponse({ status: 200, description: 'List of events by category' })
  @ApiQuery({ name: 'category', enum: ['appointment', 'vaccination', 'medication', 'grooming', 'training', 'other'] })
  @Get('category')
  async findByCategory(@Request() req, @Query('category') category: string) {
    return this.eventsService.findByCategory(req.user.id, category);
  }

  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event details' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.eventsService.findById(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update event' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Request() req) {
    return this.eventsService.update(id, req.user.id, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete event' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.delete(id, req.user.id);
  }
}