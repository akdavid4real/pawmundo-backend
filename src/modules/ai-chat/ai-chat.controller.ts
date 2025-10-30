import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiChatService } from './ai-chat.service';
import { AiChatDto } from './dto/ai-chat.dto';

@ApiTags('ai-chat')
@Controller('ai-chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  @ApiOperation({ summary: 'General AI chat with Mistral AI' })
  async chat(@Request() req, @Body() aiChatDto: AiChatDto) {
    return this.aiChatService.chat(req.user.userId, aiChatDto);
  }

  @Post('typing')
  @ApiOperation({ summary: 'Get typing indicator' })
  async getTypingIndicator() {
    return this.aiChatService.getTypingIndicator();
  }

  @Post('offline')
  @ApiOperation({ summary: 'Get offline response with user context' })
  async getOfflineResponse(@Request() req, @Body() aiChatDto: AiChatDto) {
    return this.aiChatService.getOfflineResponse(req.user.userId, aiChatDto.message);
  }
}