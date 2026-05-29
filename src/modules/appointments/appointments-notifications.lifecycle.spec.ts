import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentsService } from './appointments.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('Appointments and notifications lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';
  const clinicId = 'clinic-id';
  const vetId = 'vet-id';
  const appointmentId = 'appointment-id';

  let prisma: any;
  let petsService: any;
  let clinicsService: any;
  let appointmentsService: AppointmentsService;
  let notificationsService: NotificationsService;

  beforeEach(() => {
    prisma = {
      appointment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      notification: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        updateMany: jest.fn(),
        count: jest.fn(),
        deleteMany: jest.fn(),
      },
      notificationPreference: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    petsService = {
      findById: jest.fn().mockResolvedValue({ id: petId, ownerId: userId, isActive: true }),
    };
    clinicsService = {
      findApprovedClinicOrThrow: jest.fn().mockResolvedValue({ id: clinicId, name: 'Milo Clinic' }),
      requireActiveVetMembership: jest.fn().mockResolvedValue({
        user: { firstName: 'Ada', lastName: 'Vet', email: 'vet@example.com', phone: '123' },
      }),
      requireClinicAdmin: jest.fn().mockResolvedValue({ clinicId }),
      getActiveClinicIdsForUser: jest.fn().mockResolvedValue([clinicId]),
    };

    appointmentsService = new AppointmentsService(prisma, petsService, clinicsService);
    notificationsService = new NotificationsService(prisma);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates a clinic appointment after pet, clinic, and active vet checks', async () => {
    prisma.appointment.create.mockResolvedValueOnce({
      id: appointmentId,
      userId,
      petId,
      clinicId,
      assignedVetId: vetId,
      status: AppointmentStatus.scheduled,
    });

    const result = await appointmentsService.create(userId, {
      petId,
      clinicId,
      assignedVetId: vetId,
      appointmentDate: '2026-06-01T10:00:00.000Z',
      appointmentTime: '10:00',
      reason: 'Annual checkup',
    } as any);

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(clinicsService.findApprovedClinicOrThrow).toHaveBeenCalledWith(clinicId);
    expect(clinicsService.requireActiveVetMembership).toHaveBeenCalledWith(vetId, clinicId);
    expect(prisma.appointment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId,
        petId,
        clinicId,
        assignedVetId: vetId,
        appointmentDate: new Date('2026-06-01T10:00:00.000Z'),
        vetName: 'Ada Vet',
        vetClinic: 'Milo Clinic',
      }),
      include: expect.any(Object),
    });
    expect(result.id).toBe(appointmentId);
  });

  it('rejects appointment creation without required clinic assignment', async () => {
    await expect(
      appointmentsService.create(userId, {
        petId,
        appointmentDate: '2026-06-01T10:00:00.000Z',
        appointmentTime: '10:00',
        reason: 'Annual checkup',
      } as any),
    ).rejects.toThrow(BadRequestException);

    expect(prisma.appointment.create).not.toHaveBeenCalled();
  });

  it('denies appointment reads for another owner', async () => {
    prisma.appointment.findUnique.mockResolvedValueOnce({
      id: appointmentId,
      userId: 'other-user',
      isActive: true,
    });

    await expect(appointmentsService.findById(appointmentId, userId)).rejects.toThrow(ForbiddenException);
  });

  it('updates, cancels, and soft deletes appointments through mocked persistence', async () => {
    prisma.appointment.findUnique
      .mockResolvedValueOnce({ id: appointmentId, userId, isActive: true })
      .mockResolvedValueOnce({ id: appointmentId, userId, isActive: true })
      .mockResolvedValueOnce({ id: appointmentId, userId, isActive: true });
    prisma.appointment.update
      .mockResolvedValueOnce({ id: appointmentId, reason: 'Updated reason' })
      .mockResolvedValueOnce({ id: appointmentId, status: AppointmentStatus.cancelled })
      .mockResolvedValueOnce({ id: appointmentId, isActive: false });

    await expect(
      appointmentsService.update(appointmentId, userId, {
        reason: 'Updated reason',
        appointmentDate: '2026-06-02T10:00:00.000Z',
      } as any),
    ).resolves.toMatchObject({ reason: 'Updated reason' });
    await expect(appointmentsService.cancel(appointmentId, userId)).resolves.toMatchObject({
      status: AppointmentStatus.cancelled,
    });
    await expect(appointmentsService.delete(appointmentId, userId)).resolves.toMatchObject({
      isActive: false,
    });

    expect(prisma.appointment.update).toHaveBeenNthCalledWith(3, {
      where: { id: appointmentId },
      data: { isActive: false },
    });
  });

  it('lets clinic admins and vets transition appointments through their scoped access checks', async () => {
    prisma.appointment.findFirst
      .mockResolvedValueOnce({ id: appointmentId, clinicId, isActive: true })
      .mockResolvedValueOnce({ id: appointmentId, clinicId, assignedVetId: vetId, isActive: true });
    prisma.appointment.update
      .mockResolvedValueOnce({ id: appointmentId, status: AppointmentStatus.confirmed })
      .mockResolvedValueOnce({ id: appointmentId, status: AppointmentStatus.completed });

    await expect(
      appointmentsService.transitionForClinicAdmin(appointmentId, 'clinic-admin-id', AppointmentStatus.confirmed),
    ).resolves.toMatchObject({ status: AppointmentStatus.confirmed });
    await expect(
      appointmentsService.transitionForVet(appointmentId, vetId, AppointmentStatus.completed),
    ).resolves.toMatchObject({ status: AppointmentStatus.completed });
  });

  it('creates notification only when preferences allow it and de-dupes recent duplicates', async () => {
    prisma.notificationPreference.findUnique.mockResolvedValueOnce({
      userId,
      globalEnabled: true,
      petSettings: { [petId]: { appointments: true } },
    });
    prisma.notification.findFirst.mockResolvedValueOnce(null);
    prisma.notification.create.mockResolvedValueOnce({ id: 'notification-id', title: 'Upcoming Appointment' });

    await expect(
      notificationsService.create({
        userId,
        petId,
        title: 'Upcoming Appointment',
        message: 'Appointment tomorrow',
        type: 'appointment_notification',
      }),
    ).resolves.toMatchObject({ id: 'notification-id' });

    prisma.notificationPreference.findUnique.mockResolvedValueOnce({
      userId,
      globalEnabled: true,
      petSettings: { [petId]: { appointments: true } },
    });
    prisma.notification.findFirst.mockResolvedValueOnce({ id: 'existing-notification' });

    await expect(
      notificationsService.create({
        userId,
        petId,
        title: 'Upcoming Appointment',
        message: 'Appointment tomorrow',
        type: 'appointment_notification',
      }),
    ).resolves.toMatchObject({ id: 'existing-notification' });
    expect(prisma.notification.create).toHaveBeenCalledTimes(1);
  });

  it('suppresses notifications when global or pet-specific preferences disable the type', async () => {
    prisma.notificationPreference.findUnique.mockResolvedValueOnce({
      userId,
      globalEnabled: false,
      petSettings: {},
    });

    await expect(
      notificationsService.create({
        userId,
        petId,
        title: 'Medication Reminder',
        message: 'Give medication',
        type: 'medication_notification',
      }),
    ).resolves.toBeNull();

    prisma.notificationPreference.findUnique.mockResolvedValueOnce({
      userId,
      globalEnabled: true,
      petSettings: { [petId]: { medications: false } },
    });

    await expect(
      notificationsService.create({
        userId,
        petId,
        title: 'Medication Reminder',
        message: 'Give medication',
        type: 'medication_notification',
      }),
    ).resolves.toBeNull();
    expect(prisma.notification.create).not.toHaveBeenCalled();
  });

  it('lists notifications, marks read state, updates preferences, and removes duplicates through mocks', async () => {
    prisma.notification.findMany
      .mockResolvedValueOnce([{ id: 'n1' }])
      .mockResolvedValueOnce([
        { id: 'n1', userId, petId, type: 'reminder', title: 'Due' },
        { id: 'n2', userId, petId, type: 'reminder', title: 'Due' },
      ]);
    prisma.notification.updateMany.mockResolvedValue({ count: 1 });
    prisma.notification.count.mockResolvedValueOnce(3);
    prisma.notificationPreference.findUnique.mockResolvedValueOnce({ userId, petSettings: {} });
    prisma.notificationPreference.update.mockResolvedValueOnce({ userId, globalEnabled: true });
    prisma.notification.deleteMany.mockResolvedValueOnce({ count: 1 });

    await expect(notificationsService.findAllByUser(userId, petId)).resolves.toEqual([{ id: 'n1' }]);
    await expect(notificationsService.markAsRead('n1', userId)).resolves.toEqual({ count: 1 });
    await expect(notificationsService.getUnreadCount(userId)).resolves.toBe(3);
    await expect(notificationsService.updatePreferences(userId, { globalEnabled: true })).resolves.toMatchObject({
      globalEnabled: true,
    });
    await expect(notificationsService.removeDuplicates(userId)).resolves.toBe(1);
  });
});
