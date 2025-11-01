import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthRecordsService } from '../health-records/health-records.service';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class HealthRemindersService {
  constructor(
    private healthRecordsService: HealthRecordsService,
    private petsService: PetsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyReminders() {
    // This would integrate with a notification service
    console.log('Checking for health reminders...');
    // Implementation would send notifications to users with upcoming/overdue reminders
  }

  async getRemindersForUser(userId: string) {
    console.log('🔍 Getting reminders for userId:', userId);
    const userPets = await this.petsService.findByOwner(userId);
    console.log('🐾 User pets:', userPets.length);
    
    const [upcoming, overdue] = await Promise.all([
      this.healthRecordsService.getUpcomingReminders(userId),
      this.healthRecordsService.getOverdueReminders(userId),
    ]);
    
    console.log('📅 Upcoming records:', upcoming.length);
    console.log('⏰ Overdue records:', overdue.length);

    return {
      upcoming: upcoming.map(record => ({
        id: record._id,
        petName: (record.petId as any)?.name || 'Unknown',
        type: record.type,
        title: record.title,
        dueDate: record.nextDueDate,
        daysUntilDue: Math.ceil((record.nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      })),
      overdue: overdue.map(record => ({
        id: record._id,
        petName: (record.petId as any)?.name || 'Unknown',
        type: record.type,
        title: record.title,
        dueDate: record.nextDueDate,
        daysOverdue: Math.ceil((Date.now() - record.nextDueDate.getTime()) / (1000 * 60 * 60 * 24))
      }))
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
      isReminder: true
    }));

    return Promise.all(
      reminders.map(reminder => 
        this.healthRecordsService.create(userId, reminder)
      )
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
      ]
    };

    const schedule = schedules[species.toLowerCase()] || schedules.dog;
    
    return schedule.map(vaccine => ({
      ...vaccine,
      dueDate: new Date(birthDate.getTime() + vaccine.weeksFromBirth * 7 * 24 * 60 * 60 * 1000)
    }));
  }
}