import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from './medications.service';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';

describe('MedicationsService', () => {
  let service: MedicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: PetsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MedicationsService>(MedicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});