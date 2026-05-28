import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { ClinicsService } from '../clinics/clinics.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;

  const mockAppointment = {
    id: 'appointment-uuid-123',
    userId: 'user-uuid-123',
    petId: 'pet-uuid-123',
    vetName: 'Dr. Smith',
    vetClinic: 'Pet Clinic',
    appointmentDate: new Date('2024-12-25'),
    appointmentTime: '10:00 AM',
    reason: 'Checkup',
    status: 'scheduled',
    isActive: true,
    clinicId: null,
    assignedVetId: null,
  };

  const mockPrismaService = {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPetsService = {
    findById: jest.fn(),
  };

  const mockClinicsService = {
    findApprovedClinicOrThrow: jest.fn(),
    requireActiveVetMembership: jest.fn(),
    requireClinicAdmin: jest.fn(),
    getActiveClinicIdsForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PetsService, useValue: mockPetsService },
        { provide: ClinicsService, useValue: mockClinicsService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should reject appointment creation without a clinic', async () => {
      const createDto = {
        petId: 'pet-uuid-123',
        vetName: 'Dr. Smith',
        vetClinic: 'Pet Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup'
      };

      mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });

      await expect(service.create('user-uuid-123', createDto as any)).rejects.toThrow(BadRequestException);

      expect(mockPetsService.findById).toHaveBeenCalledWith('pet-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.appointment.create).not.toHaveBeenCalled();
    });

    it('should create a clinic appointment with a real active clinic vet', async () => {
      const createDto = {
        petId: 'pet-uuid-123',
        clinicId: 'clinic-uuid-123',
        assignedVetId: 'vet-uuid-123',
        vetName: 'Ignored Name',
        vetClinic: 'Ignored Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup',
      };

      mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });
      mockClinicsService.findApprovedClinicOrThrow.mockResolvedValue({ id: 'clinic-uuid-123', name: 'Approved Clinic' });
      mockClinicsService.requireActiveVetMembership.mockResolvedValue({
        user: {
          firstName: 'Ada',
          lastName: 'Vet',
          email: 'ada@example.com',
          phone: '123',
        },
      });
      mockPrismaService.appointment.create.mockResolvedValue({
        ...mockAppointment,
        clinicId: 'clinic-uuid-123',
        assignedVetId: 'vet-uuid-123',
      });

      await service.create('user-uuid-123', createDto as any);

      expect(mockClinicsService.requireActiveVetMembership).toHaveBeenCalledWith('vet-uuid-123', 'clinic-uuid-123');
      expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          vetName: 'Ada Vet',
          vetClinic: 'Approved Clinic',
          vetPhone: '123',
          vetEmail: 'ada@example.com',
          userId: 'user-uuid-123',
          appointmentDate: new Date(createDto.appointmentDate),
        },
        include: expect.any(Object),
      });
    });

    it('should reject clinic appointments without an assigned vet', async () => {
      mockPetsService.findById.mockResolvedValue({ id: 'pet-uuid-123', ownerId: 'user-uuid-123' });
      mockClinicsService.findApprovedClinicOrThrow.mockResolvedValue({ id: 'clinic-uuid-123', name: 'Approved Clinic' });

      await expect(service.create('user-uuid-123', {
        petId: 'pet-uuid-123',
        clinicId: 'clinic-uuid-123',
        vetName: 'Dr. Smith',
        vetClinic: 'Pet Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup',
      } as any)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.appointment.create).not.toHaveBeenCalled();
    });

    it('should reject creation when the pet is not owned by the user', async () => {
      const createDto = {
        petId: 'foreign-pet-uuid',
        vetName: 'Dr. Smith',
        vetClinic: 'Pet Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup'
      };

      mockPetsService.findById.mockRejectedValue(new ForbiddenException('Access denied'));

      await expect(service.create('user-uuid-123', createDto as any)).rejects.toThrow(ForbiddenException);
      expect(mockPrismaService.appointment.create).not.toHaveBeenCalled();
    });
  });

  describe('findByUser', () => {
    it('should find appointments by user', async () => {
      const appointments = [mockAppointment];

      mockPrismaService.appointment.findMany.mockResolvedValue(appointments);

      const result = await service.findByUser('user-uuid-123');

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123', isActive: true },
        include: expect.any(Object),
        orderBy: { appointmentDate: 'asc' }
      });
      expect(result).toEqual(appointments);
    });
  });

  describe('findById', () => {
    it('should find appointment by id', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(mockAppointment);

      const result = await service.findById('appointment-uuid-123');

      expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException when appointment not found', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own appointment', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(mockAppointment);

      await expect(service.findById('appointment-uuid-123', 'differentUser')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto = { reason: 'Updated reason' };
      const updatedAppointment = { ...mockAppointment, reason: 'Updated reason' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment as any);
      mockPrismaService.appointment.update.mockResolvedValue(updatedAppointment);

      const result = await service.update('appointment-uuid-123', 'user-uuid-123', updateDto);

      expect(service.findById).toHaveBeenCalledWith('appointment-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: updateDto,
        include: expect.any(Object),
      });
      expect(result).toEqual(updatedAppointment);
    });

    it('should update appointment with new date', async () => {
      const updateDto = { appointmentDate: '2024-12-26' };
      const updatedAppointment = { ...mockAppointment, appointmentDate: new Date('2024-12-26') };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment as any);
      mockPrismaService.appointment.update.mockResolvedValue(updatedAppointment);

      await service.update('appointment-uuid-123', 'user-uuid-123', updateDto);

      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: { appointmentDate: new Date('2024-12-26') },
        include: expect.any(Object),
      });
    });

    it('should verify ownership of a new petId during update', async () => {
      const updateDto = { petId: 'new-pet-uuid', reason: 'Updated reason' };
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment as any);
      mockPetsService.findById.mockResolvedValue({ id: 'new-pet-uuid', ownerId: 'user-uuid-123' });
      mockPrismaService.appointment.update.mockResolvedValue({ ...mockAppointment, ...updateDto });

      await service.update('appointment-uuid-123', 'user-uuid-123', updateDto as any);

      expect(mockPetsService.findById).toHaveBeenCalledWith('new-pet-uuid', 'user-uuid-123');
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment', async () => {
      const cancelledAppointment = { ...mockAppointment, status: 'cancelled' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment as any);
      mockPrismaService.appointment.update.mockResolvedValue(cancelledAppointment);

      const result = await service.cancel('appointment-uuid-123', 'user-uuid-123');

      expect(service.findById).toHaveBeenCalledWith('appointment-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: { status: 'cancelled' },
        include: expect.any(Object),
      });
      expect(result).toEqual(cancelledAppointment);
    });
  });

  describe('delete', () => {
    it('should soft delete an appointment', async () => {
      const deletedAppointment = { ...mockAppointment, isActive: false };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment as any);
      mockPrismaService.appointment.update.mockResolvedValue(deletedAppointment);

      const result = await service.delete('appointment-uuid-123', 'user-uuid-123');

      expect(service.findById).toHaveBeenCalledWith('appointment-uuid-123', 'user-uuid-123');
      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: { isActive: false },
      });
      expect(result).toEqual(deletedAppointment);
    });
  });

  describe('findUpcoming', () => {
    it('should find upcoming appointments', async () => {
      const upcomingAppointments = [mockAppointment];

      mockPrismaService.appointment.findMany.mockResolvedValue(upcomingAppointments);

      const result = await service.findUpcoming('user-uuid-123');

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-uuid-123',
          isActive: true,
          appointmentDate: { gte: expect.any(Date) },
        status: { in: ['scheduled', 'confirmed'] }
        },
        include: expect.any(Object),
        orderBy: { appointmentDate: 'asc' }
      });
      expect(result).toEqual(upcomingAppointments);
    });
  });

  describe('clinic admin operations', () => {
    it('should list appointments for the clinic admin clinic', async () => {
      mockClinicsService.requireClinicAdmin.mockResolvedValue({ clinicId: 'clinic-uuid-123' });
      mockPrismaService.appointment.findMany.mockResolvedValue([mockAppointment]);

      await service.findForClinicAdmin('admin-user-id');

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: { clinicId: 'clinic-uuid-123', isActive: true },
        include: expect.any(Object),
        orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
      });
    });

    it('should filter clinic appointments by status, vet, date, and patient inside the admin clinic', async () => {
      mockClinicsService.requireClinicAdmin.mockResolvedValue({ clinicId: 'clinic-uuid-123' });
      mockPrismaService.appointment.findMany.mockResolvedValue([mockAppointment]);

      await service.findForClinicAdmin('admin-user-id', {
        status: 'confirmed' as any,
        vetId: 'vet-uuid-123',
        date: '2026-05-28',
        patientId: 'pet-uuid-123',
      });

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          clinicId: 'clinic-uuid-123',
          isActive: true,
          status: 'confirmed',
          assignedVetId: 'vet-uuid-123',
          OR: [{ petId: 'pet-uuid-123' }, { userId: 'pet-uuid-123' }],
          appointmentDate: {
            gte: expect.any(Date),
            lt: expect.any(Date),
          },
        },
        include: expect.any(Object),
        orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
      });
    });

    it('should reject clinic admin detail outside their clinic', async () => {
      mockClinicsService.requireClinicAdmin.mockResolvedValue({ clinicId: 'clinic-uuid-123' });
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(
        service.findOneForClinicAdmin('appointment-uuid-123', 'admin-user-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update clinic appointment status for clinic admin', async () => {
      mockClinicsService.requireClinicAdmin.mockResolvedValue({ clinicId: 'clinic-uuid-123' });
      mockPrismaService.appointment.findFirst.mockResolvedValue({ ...mockAppointment, clinicId: 'clinic-uuid-123' });
      mockPrismaService.appointment.update.mockResolvedValue({ ...mockAppointment, status: 'confirmed' });

      await service.transitionForClinicAdmin('appointment-uuid-123', 'admin-user-id', 'confirmed' as any);

      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: { status: 'confirmed' },
        include: expect.any(Object),
      });
    });
  });

  describe('vet operations', () => {
    it('should list assigned appointments for active vet clinics', async () => {
      mockClinicsService.getActiveClinicIdsForUser.mockResolvedValue(['clinic-uuid-123']);
      mockPrismaService.appointment.findMany.mockResolvedValue([mockAppointment]);

      await service.findForVet('vet-uuid-123');

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: {
          assignedVetId: 'vet-uuid-123',
          isActive: true,
          OR: [{ clinicId: null }, { clinicId: { in: ['clinic-uuid-123'] } }],
        },
        include: expect.any(Object),
        orderBy: [{ appointmentDate: 'asc' }, { appointmentTime: 'asc' }],
      });
    });

    it('should reject vet appointment detail when active clinic access is missing', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue({
        ...mockAppointment,
        clinicId: 'clinic-uuid-123',
        assignedVetId: 'vet-uuid-123',
      });
      mockClinicsService.requireActiveVetMembership.mockRejectedValue(new ForbiddenException('Selected veterinarian is not active in this clinic'));

      await expect(
        service.findOneForVet('appointment-uuid-123', 'vet-uuid-123'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update assigned appointment status for vet', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue({
        ...mockAppointment,
        clinicId: null,
        assignedVetId: 'vet-uuid-123',
      });
      mockPrismaService.appointment.update.mockResolvedValue({ ...mockAppointment, status: 'completed' });

      await service.transitionForVet('appointment-uuid-123', 'vet-uuid-123', 'completed' as any);

      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'appointment-uuid-123' },
        data: { status: 'completed' },
        include: expect.any(Object),
      });
    });
  });
});
