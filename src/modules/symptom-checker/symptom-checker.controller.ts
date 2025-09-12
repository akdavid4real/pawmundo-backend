import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckDto } from './dto/symptom-check.dto';

@ApiTags('symptom-checker')
@Controller('symptom-checker')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) {}

  @Post('check')
  @ApiOperation({ summary: 'AI-powered symptom analysis for pets' })
  async checkSymptoms(@Request() req, @Body() symptomCheckDto: SymptomCheckDto) {
    return this.symptomCheckerService.checkSymptoms(req.user.userId, symptomCheckDto);
  }
}