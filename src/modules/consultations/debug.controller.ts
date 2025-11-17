import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';

@ApiTags('Debug')
@Controller('consultations/debug')
export class DebugController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation debug information (No auth required)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Debug info retrieved successfully' })
  getDebugInfo(@Param('id') id: string) {
    return this.consultationsService.getConsultationDebugInfo(id);
  }
}