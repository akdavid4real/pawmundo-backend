// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConsultationsService } from './consultations.service';
import { Consultation } from './schemas/consultation.schema';
import { PetsService } from '../pets/pets.service';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

describe('ConsultationsService', () => {
  let service: ConsultationsService;
  let model: Model<Consultation>;
  let petsService: PetsService;

  const mockConsultation = {
    _id: new Types.ObjectId(),
    userId: new Types.ObjectId(),
    petId: new Types.ObjectId(),
    status: 'pending',
    scheduledDate: new Date(),
    reason: 'Checkup',
    duration: 30,
    consultationType: 'video',
    isActive: true,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockConsultationModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: new Types.ObjectId() }),
  }));
  
  mockConsultationModel.find = jest.fn();
  mockConsultationModel.findOne = jest.fn();
  mockConsultationModel.findById = jest.fn();
  mockConsultationModel.findByIdAndUpdate = jest.fn();
  mockConsultationModel.create = jest.fn();
  mockConsultationModel.exec = jest.fn();

  const mockPetsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationsService,
        {
          provide: getModelToken(Consultation.name),
          useValue: mockConsultationModel,
        },
        {
          provide: PetsService,
          useValue: mockPetsService,
        },
      ],
    }).compile();

    service = module.get<ConsultationsService>(ConsultationsService);
    model = module.get<Model<Consultation>>(getModelToken(Consultation.name));
    petsService = module.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a consultation', async () => {
      const userId = new Types.ObjectId().toString();
      const createDto = {
        petId: new Types.ObjectId().toString(),
        scheduledDate: new Date().toISOString(),
        reason: 'Annual checkup',
        symptoms: 'None',
      };

      mockPetsService.findById.mockResolvedValue({ _id: createDto.petId });

      const result = await service.create(userId, createDto);

      expect(mockPetsService.findById).toHaveBeenCalledWith(createDto.petId, userId);
      expect(mockConsultationModel).toHaveBeenCalled();
    });
  });

  describe('getVetQueue', () => {
    it('should return pending consultations', async () => {
      const mockQueue = [mockConsultation];
      
      mockConsultationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockQueue),
          }),
        }),
      });

      const result = await service.getVetQueue();

      expect(mockConsultationModel.find).toHaveBeenCalledWith({
        status: 'pending',
        isActive: true,
      });
      expect(result).toEqual(mockQueue);
    });
  });

  describe('getVetActive', () => {
    it('should return active consultations for vet', async () => {
      const vetId = new Types.ObjectId().toString();
      const mockActive = [mockConsultation];

      mockConsultationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockActive),
          }),
        }),
      });

      const result = await service.getVetActive(vetId);

      expect(mockConsultationModel.find).toHaveBeenCalledWith({
        assignedVet: new Types.ObjectId(vetId),
        status: { $in: ['assigned', 'in-progress'] },
        isActive: true,
      });
      expect(result).toEqual(mockActive);
    });
  });

  describe('getVetHistory', () => {
    it('should return completed consultations for vet', async () => {
      const vetId = new Types.ObjectId().toString();
      const mockHistory = [mockConsultation];

      mockConsultationModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue(mockHistory),
            }),
          }),
        }),
      });

      const result = await service.getVetHistory(vetId);

      expect(mockConsultationModel.find).toHaveBeenCalledWith({
        assignedVet: new Types.ObjectId(vetId),
        status: 'completed',
        isActive: true,
      });
      expect(result).toEqual(mockHistory);
    });
  });

  describe('acceptConsultation', () => {
    it('should accept a pending consultation', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();
      
      const consultation = {
        ...mockConsultation,
        status: 'pending',
        assignedVet: undefined,
        save: jest.fn().mockResolvedValue({
          ...mockConsultation,
          assignedVet: new Types.ObjectId(vetId),
          status: 'assigned',
        }),
      };

      mockConsultationModel.findOne.mockResolvedValue(consultation);
      mockConsultationModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            ...consultation,
            assignedVet: new Types.ObjectId(vetId),
            status: 'assigned',
          }),
        }),
      });

      const result = await service.acceptConsultation(consultationId, vetId);

      expect(mockConsultationModel.findOne).toHaveBeenCalledWith({
        _id: consultationId,
        isActive: true,
      });
      expect(consultation.save).toHaveBeenCalled();
      expect(result.status).toBe('assigned');
    });

    it('should throw NotFoundException if consultation not found', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();

      mockConsultationModel.findOne.mockResolvedValue(null);

      await expect(
        service.acceptConsultation(consultationId, vetId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already assigned', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();

      const consultation = {
        ...mockConsultation,
        status: 'assigned',
      };

      mockConsultationModel.findOne.mockResolvedValue(consultation);

      await expect(
        service.acceptConsultation(consultationId, vetId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('releaseConsultation', () => {
    it('should release an assigned consultation', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();

      const consultation = {
        ...mockConsultation,
        assignedVet: new Types.ObjectId(vetId),
        status: 'assigned',
        save: jest.fn().mockResolvedValue({
          ...mockConsultation,
          assignedVet: undefined,
          status: 'pending',
        }),
      };

      mockConsultationModel.findOne.mockResolvedValue(consultation);

      const result = await service.releaseConsultation(consultationId, vetId);

      expect(mockConsultationModel.findOne).toHaveBeenCalledWith({
        _id: consultationId,
        isActive: true,
      });
      expect(consultation.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if consultation not found', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();

      mockConsultationModel.findOne.mockResolvedValue(null);

      await expect(
        service.releaseConsultation(consultationId, vetId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not assigned to vet', async () => {
      const consultationId = new Types.ObjectId().toString();
      const vetId = new Types.ObjectId().toString();
      const otherVetId = new Types.ObjectId().toString();

      const consultation = {
        ...mockConsultation,
        assignedVet: new Types.ObjectId(otherVetId),
      };

      mockConsultationModel.findOne.mockResolvedValue(consultation);

      await expect(
        service.releaseConsultation(consultationId, vetId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
