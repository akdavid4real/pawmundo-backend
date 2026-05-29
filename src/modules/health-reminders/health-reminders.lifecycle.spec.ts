import { HealthRemindersController } from './health-reminders.controller';
import { HealthRemindersService } from './health-reminders.service';

describe('Health reminders lifecycle DB-free coverage', () => {
  const userId = 'user-id';
  const petId = 'pet-id';

  let healthRecordsService: any;
  let petsService: any;
  let notificationsService: any;
  let service: HealthRemindersService;
  let controller: HealthRemindersController;

  beforeEach(() => {
    healthRecordsService = {
      getUpcomingReminders: jest.fn(),
      getOverdueReminders: jest.fn(),
      create: jest.fn(),
    };
    petsService = {
      findByOwner: jest.fn().mockResolvedValue([{ id: petId, name: 'Milo' }]),
      findById: jest.fn().mockResolvedValue({
        id: petId,
        name: 'Milo',
        species: 'dog',
        dateOfBirth: new Date('2026-01-01T00:00:00.000Z'),
      }),
    };
    notificationsService = {
      create: jest.fn().mockResolvedValue({ id: 'notification-id' }),
    };

    service = new HealthRemindersService(
      healthRecordsService,
      petsService,
      notificationsService,
    );
    controller = new HealthRemindersController(service);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns upcoming and overdue reminders and creates notification side effects through mocks', async () => {
    const upcomingDueSoon = {
      id: 'upcoming-id',
      petId,
      type: 'vaccination',
      title: 'Rabies',
      nextDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      pet: { id: petId, name: 'Milo' },
    };
    const overdue = {
      id: 'overdue-id',
      petId,
      type: 'checkup',
      title: 'Annual Checkup',
      nextDueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      pet: { id: petId, name: 'Milo' },
    };
    healthRecordsService.getUpcomingReminders.mockResolvedValueOnce([upcomingDueSoon]);
    healthRecordsService.getOverdueReminders.mockResolvedValueOnce([overdue]);

    const result = await controller.getReminders({ user: { id: userId } });

    expect(petsService.findByOwner).toHaveBeenCalledWith(userId);
    expect(notificationsService.create).toHaveBeenCalledTimes(2);
    expect(notificationsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        petId,
        title: 'Annual Checkup Overdue',
        type: 'reminder',
      }),
    );
    expect(notificationsService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        petId,
        title: 'Rabies Due Soon',
        type: 'reminder',
      }),
    );
    expect(result.upcoming[0]).toMatchObject({
      id: 'upcoming-id',
      petId,
      petName: 'Milo',
      title: 'Rabies',
    });
    expect(result.overdue[0]).toMatchObject({
      id: 'overdue-id',
      petId,
      petName: 'Milo',
      title: 'Annual Checkup',
    });
  });

  it('ignores duplicate notification failures while still returning reminder data', async () => {
    const overdue = {
      id: 'overdue-id',
      petId,
      type: 'checkup',
      title: 'Annual Checkup',
      nextDueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      pet: { id: petId, name: 'Milo' },
    };
    healthRecordsService.getUpcomingReminders.mockResolvedValueOnce([]);
    healthRecordsService.getOverdueReminders.mockResolvedValueOnce([overdue]);
    notificationsService.create.mockRejectedValueOnce(new Error('duplicate'));

    await expect(controller.getReminders({ user: { id: userId } })).resolves.toMatchObject({
      overdue: [expect.objectContaining({ id: 'overdue-id' })],
    });
  });

  it('creates vaccination reminders from the species schedule through mocked health records', async () => {
    healthRecordsService.create.mockImplementation((_userId: string, reminder: any) => ({
      id: `${reminder.title}-id`,
      ...reminder,
    }));

    const result = await controller.createVaccinationReminders(petId, { user: { id: userId } });

    expect(petsService.findById).toHaveBeenCalledWith(petId, userId);
    expect(healthRecordsService.create).toHaveBeenCalledTimes(5);
    expect(healthRecordsService.create).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        petId,
        type: 'vaccination',
        title: 'DHPP (1st)',
        isReminder: true,
      }),
    );
    expect(result).toHaveLength(5);
  });
});
