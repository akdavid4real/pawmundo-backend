import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';

@ApiTags('Test')
@Controller('test/consultations')
export class TestController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Test consultation existence (No auth)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Test result' })
  async testConsultation(@Param('id') id: string) {
    try {
      const result = await this.consultationsService.getConsultationDebugInfo(id);
      return {
        success: true,
        consultationId: id,
        ...result
      };
    } catch (error) {
      return {
        success: false,
        consultationId: id,
        error: error.message
      };
    }
  }
}