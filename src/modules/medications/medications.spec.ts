// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { MedicationsService } from './medications.service';
import { getModelToken } from '@nestjs/mongoose';
import { PetsService } from '../pets/pets.service';

describe('MedicationsService', () => {
  let service: MedicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationsService,
        {
          provide: getModelToken('Medication'),
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