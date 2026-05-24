import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { ForbiddenException } from '@nestjs/common';

describe('SeedController', () => {
  let controller: SeedController;

  const mockSeedService = {
    seedDatabase: jest.fn(),
  };

  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [{ provide: SeedService, useValue: mockSeedService }],
    }).compile();

    controller = module.get<SeedController>(SeedController);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    jest.clearAllMocks();
  });

  it('should allow seeding outside production', async () => {
    process.env.NODE_ENV = 'test';
    mockSeedService.seedDatabase.mockResolvedValue({ message: 'ok' });

    await expect(controller.seedDatabase()).resolves.toEqual({ message: 'ok' });
    expect(mockSeedService.seedDatabase).toHaveBeenCalled();
  });

  it('should block seeding in production', async () => {
    process.env.NODE_ENV = 'production';

    await expect(controller.seedDatabase()).rejects.toThrow(ForbiddenException);
    expect(mockSeedService.seedDatabase).not.toHaveBeenCalled();
  });
});
