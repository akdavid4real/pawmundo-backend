import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { assertNonProduction } from '../../common/utils/runtime-safety';

@ApiTags('Test')
@ApiBearerAuth()
@Controller('test/consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Test consultation existence (Admin only, non-production)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Test result' })
  async testConsultation(@Param('id') id: string) {
    assertNonProduction('Consultation test endpoint');
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
