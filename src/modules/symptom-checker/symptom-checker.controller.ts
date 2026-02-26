import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SymptomCheckerService } from './symptom-checker.service';
import { SymptomCheckDto } from './dto/symptom-check.dto';
import { IsString } from 'class-validator';

class ChatMessageDto {
  @IsString()
  message: string;
}

@ApiTags('symptom-checker')
@Controller('symptom-checker')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SymptomCheckerController {
  constructor(private readonly symptomCheckerService: SymptomCheckerService) { }

  @Post('check')
  @ApiOperation({ summary: 'AI-powered symptom analysis for pets' })
  async checkSymptoms(@Request() req, @Body() symptomCheckDto: SymptomCheckDto) {
    return this.symptomCheckerService.checkSymptoms(req.user.id, symptomCheckDto);
  }

  @Post('chat')
  @ApiOperation({ summary: 'Chat with Dr. Woofson AI veterinarian' })
  async chatWithAI(@Request() req, @Body() chatDto: ChatMessageDto) {
    const response = await this.symptomCheckerService.chatWithAI(req.user.id, chatDto.message);
    return { response };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get symptom check history' })
  async getHistory(@Request() req) {
    return this.symptomCheckerService.getHistory(req.user.id);
  }
}