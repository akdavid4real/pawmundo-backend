import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Medications')
@ApiBearerAuth()
@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) { }

  @Post()
  @ApiOperation({
    summary: 'Create medication record',
    description: `
      Track medications for your pets including prescriptions and supplements.
      
      **Information to Track:**
      - Medication name and dosage
      - Frequency and administration instructions
      - Start and end dates
      - Prescribing veterinarian
      - Special instructions
      
      **Use Cases:**
      - Track prescription medications
      - Monitor supplement schedules
      - Set medication reminders
      - Maintain medication history
    `
  })
  @ApiResponse({
    status: 201,
    description: 'Medication created successfully',
    schema: {
      example: {
        _id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
        petId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'twice daily',
        startDate: '2024-01-15',
        endDate: '2024-01-22',
        instructions: 'Give with food',
        status: 'active',
        createdAt: '2024-01-15T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid medication data' })
  @Post()
  create(@Request() req, @Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(req.user.userId, createMedicationDto);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active medications',
    description: `
      Retrieve all currently active medications for all your pets.
      
      **Returns:**
      - Medications with status 'active'
      - Sorted by start date (newest first)
      - Includes pet information
      
      **Useful For:**
      - Daily medication checklist
      - Current treatment overview
      - Medication reminders
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Active medications retrieved',
    schema: {
      example: [
        {
          _id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
          petId: { name: 'Buddy', species: 'dog' },
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'twice daily',
          status: 'active'
        }
      ]
    }
  })
  @Get('active')
  findActive(@Request() req) {
    return this.medicationsService.findActive(req.user.userId);
  }

  @Get('pet/:petId')
  @ApiOperation({
    summary: 'Get medications for a specific pet',
    description: 'Retrieve all medication records (active and completed) for a specific pet'
  })
  @ApiParam({ name: 'petId', description: 'Pet ID', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  @ApiResponse({ status: 200, description: 'Medications retrieved successfully' })
  @Get('pet/:petId')
  findByPet(@Param('petId') petId: string, @Request() req) {
    return this.medicationsService.findByPet(petId, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medication by ID' })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({ status: 200, description: 'Medication retrieved' })
  @ApiResponse({ status: 404, description: 'Medication not found' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.medicationsService.findById(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update medication details',
    description: 'Update medication information such as dosage, frequency, or instructions'
  })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({ status: 200, description: 'Medication updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationsService.update(id, req.user.userId, updateMedicationDto);
  }

  @Patch(':id/complete')
  @ApiOperation({
    summary: 'Mark medication as completed',
    description: `
      Mark a medication course as completed.
      
      **Effect:**
      - Changes status from 'active' to 'completed'
      - Removes from active medication list
      - Preserves in medication history
    `
  })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({ status: 200, description: 'Medication marked as completed' })
  @Patch(':id/complete')
  markCompleted(@Param('id') id: string, @Request() req) {
    return this.medicationsService.markCompleted(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete medication record',
    description: 'Soft delete a medication record (marks as inactive)'
  })
  @ApiParam({ name: 'id', description: 'Medication ID' })
  @ApiResponse({ status: 200, description: 'Medication deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.medicationsService.delete(id, req.user.userId);
  }
}