import { AiChatService } from './ai-chat.service';
import { AiChatDto } from './dto/ai-chat.dto';
export declare class AiChatController {
    private readonly aiChatService;
    constructor(aiChatService: AiChatService);
    chat(req: any, aiChatDto: AiChatDto): Promise<{
        response: any;
        typewriter: boolean;
        timestamp: string;
    }>;
    getTypingIndicator(): Promise<{
        isTyping: boolean;
        message: string;
        timestamp: string;
    }>;
    getOfflineResponse(req: any, aiChatDto: AiChatDto): Promise<{
        response: string;
        typewriter: boolean;
        timestamp: string;
    }>;
}
