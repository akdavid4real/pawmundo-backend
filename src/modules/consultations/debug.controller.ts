import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { assertNonProduction } from '../../common/utils/runtime-safety';

@ApiTags('Debug')
@ApiBearerAuth()
@Controller('consultations/debug')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DebugController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get consultation debug information (Admin only, non-production)' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  @ApiResponse({ status: 200, description: 'Debug info retrieved successfully' })
  getDebugInfo(@Param('id') id: string) {
    assertNonProduction('Consultation debug endpoint');
    return this.consultationsService.getConsultationDebugInfo(id);
  }
}
