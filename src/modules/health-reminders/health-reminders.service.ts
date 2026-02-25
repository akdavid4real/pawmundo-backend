import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthRecordsService } from '../health-records/health-records.service';
import { PetsService } from '../pets/pets.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class HealthRemindersService {
  constructor(
    private healthRecordsService: HealthRecordsService,
    private petsService: PetsService,
    private notificationsService: NotificationsService,
  ) { }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReminders() {
    console.log('Checking for health reminders...');
  }

  async getRemindersForUser(userId: string) {
    const userPets = await this.petsService.findByOwner(userId);

    const [upcoming, overdue] = await Promise.all([
      this.healthRecordsService.getUpcomingReminders(userId),
      this.healthRecordsService.getOverdueReminders(userId),
    ]);

    // Create notifications for overdue reminders
    for (const record of overdue) {
      const pet = (record as any).pet;
      const petId = pet?.id || record.petId;
      const petName = pet?.name || 'Your pet';
      const daysOverdue = Math.ceil((Date.now() - record.nextDueDate.getTime()) / (1000 * 60 * 60 * 24));

      try {
        await this.notificationsService.create({
          userId,
          petId: petId?.toString(),
          title: `${record.title} Overdue`,
          message: `${petName}'s ${record.title} is ${daysOverdue} days overdue`,
          type: 'reminder',
          actionUrl: `/pet/${petId}?tab=health`,
        });
      } catch {
        // Notification might already exist, ignore
      }
    }

    // Create notifications for upcoming reminders (within 3 days)
    for (const record of upcoming) {
      const daysUntil = Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntil <= 3) {
        const pet = (record as any).pet;
        const petId = pet?.id || record.petId;
        const petName = pet?.name || 'Your pet';

        try {
          await this.notificationsService.create({
            userId,
            petId: petId?.toString(),
            title: `${record.title} Due Soon`,
            message: `${petName}'s ${record.title} is due in ${daysUntil} days`,
            type: 'reminder',
            actionUrl: `/pet/${petId}?tab=health`,
          });
        } catch {
          // Notification might already exist, ignore
        }
      }
    }

    return {
      upcoming: upcoming.map(record => {
        const pet = (record as any).pet;
        return {
          id: record.id,
          petId: pet?.id || record.petId,
          petName: pet?.name || 'Unknown',
          type: record.type,
          title: record.title,
          dueDate: record.nextDueDate,
          daysUntilDue: Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        };
      }),
      overdue: overdue.map(record => {
        const pet = (record as any).pet;
        return {
          id: record.id,
          petId: pet?.id || record.petId,
          petName: pet?.name || 'Unknown',
          type: record.type,
          title: record.title,
          dueDate: record.nextDueDate,
          daysOverdue: Math.ceil((Date.now() - record.nextDueDate.getTime()) / (1000 * 60 * 60 * 24)),
        };
      }),
    };
  }

  async createVaccinationReminders(petId: string, userId: string) {
    const pet = await this.petsService.findById(petId, userId);
    const now = new Date();

    const vaccinationSchedule = this.getVaccinationSchedule(pet.species, pet.dateOfBirth);

    const reminders = vaccinationSchedule.map(vaccine => ({
      petId,
      type: 'vaccination',
      title: vaccine.name,
      description: vaccine.description,
      date: now,
      nextDueDate: vaccine.dueDate,
      isReminder: true,
    }));

    return Promise.all(
      reminders.map(reminder =>
        this.healthRecordsService.create(userId, reminder),
      ),
    );
  }

  private getVaccinationSchedule(species: string, birthDate: Date) {
    const schedules = {
      dog: [
        { name: 'DHPP (1st)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 6 },
        { name: 'DHPP (2nd)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 9 },
        { name: 'DHPP (3rd)', description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza', weeksFromBirth: 12 },
        { name: 'Rabies', description: 'Rabies vaccination', weeksFromBirth: 16 },
        { name: 'DHPP Annual', description: 'Annual DHPP booster', weeksFromBirth: 52 },
      ],
      cat: [
        { name: 'FVRCP (1st)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 6 },
        { name: 'FVRCP (2nd)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 9 },
        { name: 'FVRCP (3rd)', description: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', weeksFromBirth: 12 },
        { name: 'Rabies', description: 'Rabies vaccination', weeksFromBirth: 16 },
        { name: 'FVRCP Annual', description: 'Annual FVRCP booster', weeksFromBirth: 52 },
      ],
    };

    const schedule = schedules[species.toLowerCase()] || schedules.dog;

    return schedule.map(vaccine => ({
      ...vaccine,
      dueDate: new Date(birthDate.getTime() + vaccine.weeksFromBirth * 7 * 24 * 60 * 60 * 1000),
    }));
  }
}