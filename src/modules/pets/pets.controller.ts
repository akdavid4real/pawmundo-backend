import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@ApiTags('pets')
@ApiBearerAuth()
@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @ApiOperation({ summary: 'Add a new pet' })
  @ApiResponse({ status: 201, description: 'Pet created successfully' })
  @Post()
  async create(@Request() req, @Body() createPetDto: CreatePetDto) {
    const petData = {
      ...createPetDto,
      ownerId: req.user._id,
      dateOfBirth: createPetDto.dateOfBirth ? new Date(createPetDto.dateOfBirth) : undefined
    };
    return this.petsService.create(petData);
  }

  @ApiOperation({ summary: 'Get all user pets' })
  @ApiResponse({ status: 200, description: 'List of user pets' })
  @ApiQuery({ name: 'species', required: false, description: 'Filter by species' })
  @Get()
  async findMyPets(@Request() req, @Query('species') species?: string) {
    return this.petsService.findByOwner(req.user._id, species);
  }

  @ApiOperation({ summary: 'Get pet by ID' })
  @ApiResponse({ status: 200, description: 'Pet details' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.petsService.findById(id, req.user._id);
  }

  @ApiOperation({ summary: 'Update pet information' })
  @ApiResponse({ status: 200, description: 'Pet updated successfully' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto, @Request() req) {
    const petData: any = { ...updatePetDto };
    if (updatePetDto.dateOfBirth) {
      petData.dateOfBirth = new Date(updatePetDto.dateOfBirth);
    }
    return this.petsService.update(id, req.user._id, petData);
  }

  @ApiOperation({ summary: 'Update pet health status' })
  @ApiResponse({ status: 200, description: 'Health status updated' })
  @Put(':id/health-status')
  async updateHealthStatus(@Param('id') id: string, @Body('status') status: string, @Request() req) {
    return this.petsService.updateHealthStatus(id, req.user._id, status);
  }

  @ApiOperation({ summary: 'Delete pet' })
  @ApiResponse({ status: 200, description: 'Pet deleted successfully' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.petsService.delete(id, req.user._id);
  }
}