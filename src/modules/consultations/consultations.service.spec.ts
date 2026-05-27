import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationsService } from './consultations.service';
import { PetsService } from '../pets/pets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ClinicsService } from '../clinics/clinics.service';

describe('ConsultationsService', () => {
  let service: ConsultationsService;
  let prisma: PrismaService;
  let petsService: PetsService;
  let clinicsService: ClinicsService;

  const mockConsultation = {
    id: 'test-consult-uuid',
    userId: 'user-uuid-123',
    petId: 'pet-uuid-123',
    status: 'pending',
    scheduledDate: new Date(),
    reason: 'Checkup',
    symptoms: 'None',
    duration: 30,
    consultationType: 'video',
    isActive: true,
    assignedVetId: null,
  };

  const mockPet = {
    id: 'pet-uuid-123',
    name: 'Buddy',
    species: 'dog',
    ownerId: 'user-uuid-123',
  };

  const mockPrismaService = {
    consultation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    consultationMessage: {
      create: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockPetsService = {
    findById: jest.fn(),
  };

  const mockClinicsService = {
    findApprovedClinicOrThrow: jest.fn(),
    getActiveClinicForUser: jest.fn(),
    requireVetClinicAccess: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PetsService, useValue: mockPetsService },
        { provide: ClinicsService, useValue: mockClinicsService },
      ],
    }).compile();

    service = module.get<ConsultationsService>(ConsultationsService);
    prisma = module.get<PrismaService>(PrismaService);
    petsService = module.get<PetsService>(PetsService);
    clinicsService = module.get<ClinicsService>(ClinicsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a consultation', async () => {
      const userId = 'user-uuid-123';
      const createDto = {
        petId: 'pet-uuid-123',
        scheduledDate: new Date().toISOString(),
        reason: 'Annual checkup',
        symptoms: 'None',
      };

      mockPetsService.findById.mockResolvedValue(mockPet);
      mockPrismaService.consultation.create.mockResolvedValue(mockConsultation);

      const result = await service.create(userId, createDto as any);

      expect(mockPetsService.findById).toHaveBeenCalledWith(createDto.petId, userId);
      expect(mockPrismaService.consultation.create).toHaveBeenCalled();
      expect(result).toEqual(mockConsultation);
    });
  });

  describe('findByStatus', () => {
    it('should map public in-progress status values to prisma enum values', async () => {
      mockPrismaService.consultation.findMany.mockResolvedValue([mockConsultation]);

      await service.findByStatus('user-uuid-123', 'in-progress');

      expect(mockPrismaService.consultation.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123', status: 'in_progress', isActive: true },
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { scheduledDate: 'desc' },
      });
    });

    it('should map legacy active and ended aliases to canonical prisma enum values', async () => {
      mockPrismaService.consultation.findMany.mockResolvedValue([mockConsultation]);

      await service.findByStatus('user-uuid-123', 'active');
      expect(mockPrismaService.consultation.findMany).toHaveBeenLastCalledWith({
        where: { userId: 'user-uuid-123', status: 'in_progress', isActive: true },
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { scheduledDate: 'desc' },
      });

      await service.findByStatus('user-uuid-123', 'ended');
      expect(mockPrismaService.consultation.findMany).toHaveBeenLastCalledWith({
        where: { userId: 'user-uuid-123', status: 'completed', isActive: true },
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { scheduledDate: 'desc' },
      });
    });
  });

  describe('update', () => {
    it('should map public status and payment aliases before persisting', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(mockConsultation as any);
      mockPrismaService.consultation.update.mockResolvedValue({ ...mockConsultation, status: 'in_progress' });

      await service.update('test-consult-uuid', 'user-uuid-123', {
        status: 'in-progress',
        paymentStatus: 'pending',
      } as any);

      expect(mockPrismaService.consultation.update).toHaveBeenCalledWith({
        where: { id: 'test-consult-uuid' },
        data: {
          status: 'in_progress',
          paymentStatus: 'pending_payment',
        },
      });
    });
  });

  describe('getVetQueue', () => {
    it('should return pending consultations', async () => {
      const mockQueue = [mockConsultation];
      const vetId = 'vet-uuid-123';
      
      mockClinicsService.getActiveClinicForUser.mockResolvedValue(null);
      mockPrismaService.consultation.findMany.mockResolvedValue(mockQueue);

      const result = await service.getVetQueue(vetId);

      expect(mockClinicsService.getActiveClinicForUser).toHaveBeenCalledWith(vetId);
      expect(mockPrismaService.consultation.findMany).toHaveBeenCalledWith({
        where: { status: 'pending', isActive: true },
        include: {
          pet: { select: { name: true, species: true, breed: true, age: true } },
          user: { select: { firstName: true, lastName: true, email: true } }
        },
        orderBy: { scheduledDate: 'asc' },
      });
      expect(result).toEqual(mockQueue);
    });
  });

  describe('getVetActive', () => {
    it('should return active consultations for vet', async () => {
      const vetId = 'vet-uuid-123';
      const mockActive = [mockConsultation];

      mockPrismaService.consultation.findMany.mockResolvedValue(mockActive);

      const result = await service.getVetActive(vetId);

      expect(mockPrismaService.consultation.findMany).toHaveBeenCalledWith({
        where: {
          assignedVetId: vetId,
          status: { in: ['assigned', 'in_progress'] },
          isActive: true,
        },
        include: {
          pet: { select: { name: true, species: true, breed: true, age: true, weight: true } },
          user: { select: { firstName: true, lastName: true, email: true, phone: true } }
        },
        orderBy: { scheduledDate: 'asc' },
      });
      expect(result).toEqual(mockActive);
    });
  });

  describe('getVetHistory', () => {
    it('should return completed consultations for vet', async () => {
      const vetId = 'vet-uuid-123';
      const mockHistory = [mockConsultation];

      mockPrismaService.consultation.findMany.mockResolvedValue(mockHistory);

      const result = await service.getVetHistory(vetId);

      expect(mockPrismaService.consultation.findMany).toHaveBeenCalledWith({
        where: {
          assignedVetId: vetId,
          status: 'completed',
          isActive: true,
        },
        include: {
          pet: { select: { name: true, species: true } },
          user: { select: { firstName: true, lastName: true } }
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });
      expect(result).toEqual(mockHistory);
    });
  });

  describe('acceptConsultation', () => {
    it('should accept a pending consultation', async () => {
      const consultationId = 'test-consult-uuid';
      const vetId = 'vet-uuid-123';
      
      const consultation = {
        ...mockConsultation,
        status: 'pending',
      };

      const updatedConsultation = {
        ...consultation,
        status: 'assigned',
        assignedVetId: vetId
      }

      mockPrismaService.consultation.findFirst.mockResolvedValue(consultation);
      mockClinicsService.requireVetClinicAccess.mockResolvedValue(null);
      // The service also calls findUnique at the end of the method
      mockPrismaService.consultation.findUnique.mockResolvedValue(updatedConsultation);

      const result = await service.acceptConsultation(consultationId, vetId);

      expect(mockPrismaService.consultation.findFirst).toHaveBeenCalledWith({
        where: { id: consultationId, isActive: true },
      });
      expect(mockClinicsService.requireVetClinicAccess).toHaveBeenCalledWith(vetId, undefined);
      expect(mockPrismaService.consultation.update).toHaveBeenCalled();
      expect(result.status).toBe('assigned');
    });

    it('should throw NotFoundException if consultation not found', async () => {
      const consultationId = 'nonexistent';
      const vetId = 'vet-uuid-123';

      mockPrismaService.consultation.findFirst.mockResolvedValue(null);

      await expect(
        service.acceptConsultation(consultationId, vetId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already assigned', async () => {
      const consultationId = 'test-consult-uuid';
      const vetId = 'vet-uuid-123';

      const consultation = {
        ...mockConsultation,
        status: 'assigned',
        assignedVetId: 'another-vet'
      };

      mockPrismaService.consultation.findFirst.mockResolvedValue(consultation);

      await expect(
        service.acceptConsultation(consultationId, vetId),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('releaseConsultation', () => {
    it('should release an assigned consultation', async () => {
      const consultationId = 'test-consult-uuid';
      const vetId = 'vet-uuid-123';

      const consultation = {
        ...mockConsultation,
        assignedVetId: vetId,
        status: 'assigned',
      };

      mockPrismaService.consultation.findFirst.mockResolvedValue(consultation);

      await service.releaseConsultation(consultationId, vetId);

      expect(mockPrismaService.consultation.findFirst).toHaveBeenCalledWith({
        where: { id: consultationId, isActive: true },
      });
      expect(mockPrismaService.consultation.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if consultation not found', async () => {
      const consultationId = 'nonexistent';
      const vetId = 'vet-uuid-123';

      mockPrismaService.consultation.findFirst.mockResolvedValue(null);

      await expect(
        service.releaseConsultation(consultationId, vetId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if not assigned to vet', async () => {
      const consultationId = 'test-consult-uuid';
      const vetId = 'vet-uuid-123';
      const otherVetId = 'other-vet-123';

      const consultation = {
        ...mockConsultation,
        assignedVetId: otherVetId,
      };

      mockPrismaService.consultation.findFirst.mockResolvedValue(consultation);

      await expect(
        service.releaseConsultation(consultationId, vetId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('completeConsultation', () => {
    it('should allow the assigned vet to complete an active consultation', async () => {
      const consultation = {
        ...mockConsultation,
        status: 'assigned',
        assignedVetId: 'vet-uuid-123',
      };
      mockPrismaService.consultation.findFirst.mockResolvedValue(consultation);
      mockPrismaService.consultation.update.mockResolvedValue({ ...consultation, status: 'completed' });

      await service.completeConsultation('test-consult-uuid', 'vet-uuid-123', 'Done');

      expect(mockPrismaService.consultation.update).toHaveBeenCalledWith({
        where: { id: 'test-consult-uuid' },
        data: {
          status: 'completed',
          notes: 'Done',
          prescription: undefined,
        },
      });
    });

    it('should reject completing a terminal consultation', async () => {
      mockPrismaService.consultation.findFirst.mockResolvedValue({
        ...mockConsultation,
        status: 'completed',
      });

      await expect(
        service.completeConsultation('test-consult-uuid', 'user-uuid-123', 'Done'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('sendMessage', () => {
    it('should reject messages in terminal consultations', async () => {
      mockPrismaService.consultation.findFirst.mockResolvedValue({
        ...mockConsultation,
        status: 'cancelled',
        messages: [],
        pet: { name: 'Buddy', species: 'dog' },
      });

      await expect(
        service.sendMessage('test-consult-uuid', 'user-uuid-123', 'Hello'),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.consultationMessage.create).not.toHaveBeenCalled();
    });
  });
});
