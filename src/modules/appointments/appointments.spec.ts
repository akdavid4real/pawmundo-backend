import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createDto = {
        petId: 'pet-uuid-123',
        vetName: 'Dr. Smith',
        vetClinic: 'Pet Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup'
      };

      mockPrismaService.appointment.create.mockResolvedValue(mockAppointment);

      const result = await service.create('user-uuid-123', createDto as any);

      expect(mockPrismaService.appointment.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          userId: 'user-uuid-123',
          appointmentDate: new Date(createDto.appointmentDate)
        }
      });
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('findByUser', () => {
    it('should find appointments by user', async () => {
      const appointments = [mockAppointment];

      mockPrismaService.appointment.findMany.mockResolvedValue(appointments);

      const result = await service.findByUser('user-uuid-123');

      expect(mockPrismaService.appointment.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-123', isActive: true },
        include: { pet: { select: { name: true, species: true, breed: true } } },
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
        include: { pet: { select: { name: true, species: true, breed: true } } },
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
        include: { pet: { select: { name: true, species: true, breed: true } } },
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
        include: { pet: { select: { name: true, species: true, breed: true } } },
      });
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
        include: { pet: { select: { name: true, species: true, breed: true } } },
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
        include: { pet: { select: { name: true, species: true, breed: true } } },
        orderBy: { appointmentDate: 'asc' }
      });
      expect(result).toEqual(upcomingAppointments);
    });
  });
});
