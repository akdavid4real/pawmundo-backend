import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './schemas/appointment.schema';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let mockAppointmentModel: any;

  const mockAppointment = {
    _id: '507f1f77bcf86cd799439011',
    userId: 'user123',
    petId: 'pet123',
    vetName: 'Dr. Smith',
    vetClinic: 'Pet Clinic',
    appointmentDate: new Date('2024-12-25'),
    appointmentTime: '10:00 AM',
    reason: 'Checkup',
    status: 'scheduled',
    isActive: true,
    save: jest.fn().mockResolvedValue(this)
  } as any;

  beforeEach(async () => {
    const mockQuery = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn()
    };

    mockAppointmentModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockAppointment)
    }));
    mockAppointmentModel.find = jest.fn(() => mockQuery);
    mockAppointmentModel.findById = jest.fn(() => mockQuery);
    mockAppointmentModel.findByIdAndUpdate = jest.fn(() => mockQuery);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getModelToken(Appointment.name),
          useValue: mockAppointmentModel,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createDto = {
        petId: 'pet123',
        vetName: 'Dr. Smith',
        vetClinic: 'Pet Clinic',
        appointmentDate: '2024-12-25',
        appointmentTime: '10:00 AM',
        reason: 'Checkup'
      };
      mockAppointmentModel.mockReturnValue({
        save: jest.fn().mockResolvedValue(mockAppointment)
      });

      const result = await service.create('user123', createDto);

      expect(mockAppointmentModel).toHaveBeenCalledWith({
        ...createDto,
        userId: 'user123',
        appointmentDate: new Date(createDto.appointmentDate)
      });
      expect(result).toEqual(mockAppointment);
    });
  });

  describe('findByUser', () => {
    it('should find appointments by user', async () => {
      const appointments = [mockAppointment];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(appointments)
      };
      mockAppointmentModel.find.mockReturnValue(mockQuery);

      const result = await service.findByUser('user123');

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({ userId: 'user123', isActive: true });
      expect(mockQuery.populate).toHaveBeenCalledWith('petId', 'name species breed');
      expect(mockQuery.sort).toHaveBeenCalledWith({ appointmentDate: 1 });
      expect(result).toEqual(appointments);
    });
  });

  describe('findById', () => {
    it('should find appointment by id', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockAppointment)
      };
      mockAppointmentModel.findById.mockReturnValue(mockQuery);

      const result = await service.findById('507f1f77bcf86cd799439011');

      expect(mockAppointmentModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockQuery.populate).toHaveBeenCalledWith('petId', 'name species breed');
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException when appointment not found', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null)
      };
      mockAppointmentModel.findById.mockReturnValue(mockQuery);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own appointment', async () => {
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockAppointment)
      };
      mockAppointmentModel.findById.mockReturnValue(mockQuery);

      await expect(service.findById('507f1f77bcf86cd799439011', 'differentUser')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update an appointment', async () => {
      const updateDto = { reason: 'Updated reason' };
      const updatedAppointment = { ...mockAppointment, reason: 'Updated reason' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment);
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedAppointment)
      };
      mockAppointmentModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.update('507f1f77bcf86cd799439011', 'user123', updateDto);

      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockAppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto, { new: true });
      expect(result).toEqual(updatedAppointment);
    });

    it('should update appointment with new date', async () => {
      const updateDto = { appointmentDate: '2024-12-26' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment);
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockAppointment)
      };
      mockAppointmentModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      await service.update('507f1f77bcf86cd799439011', 'user123', updateDto);

      expect(mockAppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { appointmentDate: new Date('2024-12-26') },
        { new: true }
      );
    });
  });

  describe('cancel', () => {
    it('should cancel an appointment', async () => {
      const cancelledAppointment = { ...mockAppointment, status: 'cancelled' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment);
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(cancelledAppointment)
      };
      mockAppointmentModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.cancel('507f1f77bcf86cd799439011', 'user123');

      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockAppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { status: 'cancelled' },
        { new: true }
      );
      expect(result).toEqual(cancelledAppointment);
    });
  });

  describe('delete', () => {
    it('should soft delete an appointment', async () => {
      const deletedAppointment = { ...mockAppointment, isActive: false };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockAppointment);
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(deletedAppointment)
      };
      mockAppointmentModel.findByIdAndUpdate.mockReturnValue(mockQuery);

      const result = await service.delete('507f1f77bcf86cd799439011', 'user123');

      expect(service.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011', 'user123');
      expect(mockAppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { isActive: false },
        { new: true }
      );
      expect(result).toEqual(deletedAppointment);
    });
  });

  describe('findUpcoming', () => {
    it('should find upcoming appointments', async () => {
      const upcomingAppointments = [mockAppointment];
      const mockQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(upcomingAppointments)
      };
      mockAppointmentModel.find.mockReturnValue(mockQuery);

      const result = await service.findUpcoming('user123');

      expect(mockAppointmentModel.find).toHaveBeenCalledWith({
        userId: 'user123',
        isActive: true,
        appointmentDate: { $gte: expect.any(Date) },
        status: { $in: ['scheduled', 'confirmed'] }
      });
      expect(mockQuery.populate).toHaveBeenCalledWith('petId', 'name species breed');
      expect(mockQuery.sort).toHaveBeenCalledWith({ appointmentDate: 1 });
      expect(result).toEqual(upcomingAppointments);
    });
  });
});