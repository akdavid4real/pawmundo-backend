import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  create(@Request() req, @Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(req.user.userId, createMedicationDto);
  }

  @Get('active')
  findActive(@Request() req) {
    return this.medicationsService.findActive(req.user.userId);
  }

  @Get('pet/:petId')
  findByPet(@Param('petId') petId: string, @Request() req) {
    return this.medicationsService.findByPet(petId, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.medicationsService.findById(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req, @Body() updateMedicationDto: UpdateMedicationDto) {
    return this.medicationsService.update(id, req.user.userId, updateMedicationDto);
  }

  @Patch(':id/complete')
  markCompleted(@Param('id') id: string, @Request() req) {
    return this.medicationsService.markCompleted(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.medicationsService.delete(id, req.user.userId);
  }
}