import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(JwtAuthGuard)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Request() req, @Body() petData: any) {
    return this.petsService.create({ ...petData, ownerId: req.user.userId });
  }

  @Get()
  async findMyPets(@Request() req) {
    return this.petsService.findByOwner(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.petsService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.petsService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.petsService.delete(id);
  }
}