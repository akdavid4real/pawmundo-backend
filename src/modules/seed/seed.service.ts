import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { NotificationType, EventCategory, EventStatus, Prisma } from '@prisma/client';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) { }

  async seedDatabase() {
    try {
      // Clear existing data in proper order (respecting foreign keys)
      console.log('🗑️ Clearing existing data...');
      await this.prisma.consultationMessage.deleteMany({});
      await this.prisma.forumLike.deleteMany({});
      await this.prisma.forumReply.deleteMany({});
      await this.prisma.insuranceClaim.deleteMany({});
      await this.prisma.symptomCheck.deleteMany({});
      await this.prisma.activity.deleteMany({});
      await this.prisma.notification.deleteMany({});
      await this.prisma.notificationPreference.deleteMany({});
      await this.prisma.event.deleteMany({});
      await this.prisma.medication.deleteMany({});
      await this.prisma.healthRecord.deleteMany({});
      await this.prisma.appointment.deleteMany({});
      await this.prisma.consultation.deleteMany({});
      await this.prisma.forumPost.deleteMany({});
      await this.prisma.insurance.deleteMany({});
      await this.prisma.pet.deleteMany({});
      await this.prisma.user.deleteMany({});
      console.log('✅ Existing data cleared');

      // Create sample users
      console.log('👥 Creating users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      const akDavid = await this.prisma.user.create({
        data: {
          firstName: 'David',
          lastName: 'Ak',
          email: 'akdavid4real@gmail.com',
          password: await bcrypt.hash('Shadowfight@2', 10),
          role: 'user',
          isEmailVerified: true,
          phone: '+1234567890',
          address: '123 Main St, City, State 12345',
        },
      });

      const user1 = await this.prisma.user.create({
        data: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: hashedPassword,
          role: 'user',
          isEmailVerified: true,
        },
      });

      const user2 = await this.prisma.user.create({
        data: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          password: hashedPassword,
          role: 'vet',
          isEmailVerified: true,
        },
      });

      // Create sample pets
      console.log('🐾 Creating pets...');
      const luna = await this.prisma.pet.create({
        data: {
          name: 'Luna',
          species: 'dog',
          breed: 'Golden Retriever',
          age: 3,
          gender: 'female',
          weight: 28,
          color: 'Golden',
          dateOfBirth: new Date('2023-01-15'),
          ownerId: akDavid.id,
          healthStatus: 'healthy',
        },
      });

      const shadow = await this.prisma.pet.create({
        data: {
          name: 'Shadow',
          species: 'cat',
          breed: 'Persian',
          age: 5,
          gender: 'male',
          weight: 4.5,
          color: 'Gray',
          dateOfBirth: new Date('2021-06-20'),
          ownerId: akDavid.id,
          healthStatus: 'healthy',
        },
      });

      const buddy = await this.prisma.pet.create({
        data: {
          name: 'Buddy',
          species: 'dog',
          breed: 'Labrador',
          age: 2,
          gender: 'male',
          weight: 30,
          color: 'Black',
          dateOfBirth: new Date('2024-03-10'),
          ownerId: akDavid.id,
          healthStatus: 'healthy',
        },
      });

      // Create sample health records
      console.log('🏥 Creating health records...');
      await this.prisma.healthRecord.createMany({
        data: [
          {
            petId: luna.id,
            type: 'vaccination',
            title: 'Rabies Vaccination',
            description: 'Annual rabies vaccination',
            date: new Date('2025-01-15'),
            nextDueDate: new Date('2026-01-15'),
            isReminder: true,
          },
          {
            petId: luna.id,
            type: 'checkup',
            title: 'Annual Checkup',
            description: 'Routine annual checkup',
            date: new Date('2025-02-01'),
          },
          {
            petId: shadow.id,
            type: 'vaccination',
            title: 'FVRCP Vaccination',
            description: 'Feline core vaccination',
            date: new Date('2025-01-20'),
            nextDueDate: new Date('2026-01-20'),
            isReminder: true,
          },
        ],
      });

      // Create sample medications
      console.log('💊 Creating medications...');
      await this.prisma.medication.createMany({
        data: [
          {
            petId: luna.id,
            name: 'Heartgard Plus',
            dosage: '1 tablet',
            frequency: 'monthly',
            startDate: new Date('2025-01-01'),
            instructions: 'Give with food on the 1st of each month',
          },
          {
            petId: shadow.id,
            name: 'Frontline Plus',
            dosage: '1 pipette',
            frequency: 'monthly',
            startDate: new Date('2025-01-15'),
            instructions: 'Apply to back of neck',
          },
        ],
      });

      // Create sample notifications
      console.log('🔔 Creating notifications...');
      const notifications: Prisma.NotificationUncheckedCreateInput[] = [
        {
          userId: akDavid.id,
          petId: luna.id,
          title: 'Vaccination Due',
          message: "Luna's rabies vaccination is due soon",
          type: NotificationType.vaccination,
          actionUrl: `/pets/${luna.id}/health-records`,
        },
        {
          userId: akDavid.id,
          petId: shadow.id,
          title: 'Medication Reminder',
          message: "Time to give Shadow's Frontline Plus",
          type: NotificationType.medication_notification,
          actionUrl: `/pets/${shadow.id}/medications`,
        },
      ];
      await this.prisma.notification.createMany({ data: notifications });

      // Create sample events
      console.log('📅 Creating events...');
      const events: Prisma.EventUncheckedCreateInput[] = [
        {
          userId: akDavid.id,
          petId: luna.id,
          title: 'Vet Visit',
          description: 'Annual checkup at City Vet Clinic',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          category: EventCategory.event_appointment,
          status: EventStatus.event_scheduled,
        },
        {
          userId: akDavid.id,
          petId: luna.id,
          title: 'Dog Park Meetup',
          description: 'Weekly dog park meetup',
          eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          category: EventCategory.training,
          status: EventStatus.event_scheduled,
        },
      ];
      await this.prisma.event.createMany({ data: events });

      return {
        message: 'Database seeded successfully!',
        summary: {
          users: 2,
          pets: 3,
          healthRecords: 3,
          medications: 2,
          notifications: 2,
          events: 2,
        },
      };
    } catch (error) {
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }
}
