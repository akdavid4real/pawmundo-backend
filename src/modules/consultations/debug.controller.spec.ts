import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { DebugController } from './debug.controller';
import { ConsultationsService } from './consultations.service';

describe('DebugController', () => {
  let controller: DebugController;

  const mockConsultationsService = {
    getConsultationDebugInfo: jest.fn(),
  };

  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebugController],
      providers: [{ provide: ConsultationsService, useValue: mockConsultationsService }],
    }).compile();

    controller = module.get<DebugController>(DebugController);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  it('should return debug data outside production', async () => {
    process.env.NODE_ENV = 'test';
    mockConsultationsService.getConsultationDebugInfo.mockResolvedValue({ exists: true });

    await expect(controller.getDebugInfo('consult-uuid')).resolves.toEqual({ exists: true });
    expect(mockConsultationsService.getConsultationDebugInfo).toHaveBeenCalledWith('consult-uuid');
  });

  it('should block debug access in production', () => {
    process.env.NODE_ENV = 'production';

    expect(() => controller.getDebugInfo('consult-uuid')).toThrow(ForbiddenException);
    expect(mockConsultationsService.getConsultationDebugInfo).not.toHaveBeenCalled();
  });
});
