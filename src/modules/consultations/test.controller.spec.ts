import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { TestController } from './test.controller';
import { ConsultationsService } from './consultations.service';

describe('TestController', () => {
  let controller: TestController;

  const mockConsultationsService = {
    getConsultationDebugInfo: jest.fn(),
  };

  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [{ provide: ConsultationsService, useValue: mockConsultationsService }],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  it('should return a wrapped success payload outside production', async () => {
    process.env.NODE_ENV = 'test';
    mockConsultationsService.getConsultationDebugInfo.mockResolvedValue({ exists: true, status: 'pending' });

    await expect(controller.testConsultation('consult-uuid')).resolves.toEqual({
      success: true,
      consultationId: 'consult-uuid',
      exists: true,
      status: 'pending',
    });
  });

  it('should block test access in production', async () => {
    process.env.NODE_ENV = 'production';

    await expect(controller.testConsultation('consult-uuid')).rejects.toThrow(ForbiddenException);
    expect(mockConsultationsService.getConsultationDebugInfo).not.toHaveBeenCalled();
  });
});
