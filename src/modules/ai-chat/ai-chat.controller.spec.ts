import { Test, TestingModule } from '@nestjs/testing';
import { AiChatController } from './ai-chat.controller';
import { AiChatService } from './ai-chat.service';

describe('AiChatController', () => {
  let controller: AiChatController;
  let service: AiChatService;

  const mockAiChatService = {
    chat: jest.fn(),
    getTypingIndicator: jest.fn(),
    getOfflineResponse: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiChatController],
      providers: [
        { provide: AiChatService, useValue: mockAiChatService },
      ],
    }).compile();

    controller = module.get<AiChatController>(AiChatController);
    service = module.get<AiChatService>(AiChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('chat', () => {
    it('should call chat service method and return response', async () => {
      const mockResponse = { response: 'Hello', typewriter: true };
      mockAiChatService.chat.mockResolvedValue(mockResponse);

      const mockDto = { message: 'Hi', context: 'general' };
      const req = { user: { id: 'user-id' } };

      const result = await controller.chat(req, mockDto);

      expect(mockAiChatService.chat).toHaveBeenCalledWith('user-id', mockDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTypingIndicator', () => {
    it('should return typing indicator from service', async () => {
      const mockIndicator = { isTyping: true, message: 'Typing...', timestamp: 'date' };
      mockAiChatService.getTypingIndicator.mockResolvedValue(mockIndicator);

      const result = await controller.getTypingIndicator();

      expect(mockAiChatService.getTypingIndicator).toHaveBeenCalled();
      expect(result).toEqual(mockIndicator);
    });
  });

  describe('getOfflineResponse', () => {
    it('should call getOfflineResponse service method and return response', async () => {
      const mockResponse = { response: 'Offline Hello' };
      mockAiChatService.getOfflineResponse.mockResolvedValue(mockResponse);

      const mockDto = { message: 'Hi' };
      const req = { user: { id: 'user-id' } };

      const result = await controller.getOfflineResponse(req, mockDto);

      expect(mockAiChatService.getOfflineResponse).toHaveBeenCalledWith('user-id', 'Hi');
      expect(result).toEqual(mockResponse);
    });
  });
});
