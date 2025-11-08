import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { sampleUsers, samplePets, sampleHealthRecords, sampleMedications, sampleNotifications, sampleEvents, sampleReminders } from './index';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection
  ) {}

  async seedDatabase() {
    try {
      const db = this.connection.db;

      // Clear existing data
      console.log('🗑️ Clearing existing data...');
      await this.userModel.deleteMany({});
      await db.collection('pets').deleteMany({});
      await db.collection('healthrecords').deleteMany({});
      await db.collection('medications').deleteMany({});
      await db.collection('notifications').deleteMany({});
      await db.collection('notificationpreferences').deleteMany({});
      await db.collection('events').deleteMany({});
      console.log('✅ Existing data cleared');

      // Create users
      console.log('👥 Creating users...');
      await this.userModel.insertMany(sampleUsers);

      console.log('🐾 Creating pets...');
      await db.collection('pets').insertMany(samplePets);
      
      console.log('🏥 Creating health records...');
      const luna = await db.collection('pets').findOne({ name: 'Luna' });
      const shadow = await db.collection('pets').findOne({ name: 'Shadow' });
      const buddy = await db.collection('pets').findOne({ name: 'Buddy' });
      
      console.log('Luna ID from DB:', luna?._id.toString());
      console.log('Shadow ID from DB:', shadow?._id.toString());
      console.log('Sample record petId:', sampleHealthRecords[0]?.petId.toString());
      
      const healthRecordsWithCorrectPets = sampleHealthRecords.map(record => {
        const recordPetIdStr = record.petId.toString();
        if (luna && recordPetIdStr === luna._id.toString()) return { ...record, petId: luna._id };
        if (shadow && recordPetIdStr === shadow._id.toString()) return { ...record, petId: shadow._id };
        if (buddy && recordPetIdStr === buddy._id.toString()) return { ...record, petId: buddy._id };
        return record;
      });
      
      await db.collection('healthrecords').insertMany(healthRecordsWithCorrectPets);
      console.log(`✅ Inserted ${healthRecordsWithCorrectPets.length} health records`);
      
      console.log('💊 Creating medications...');
      await db.collection('medications').insertMany(sampleMedications);
      
      console.log('🔔 Creating notifications...');
      await db.collection('notifications').insertMany(sampleNotifications);
      
      console.log('📅 Creating events...');
      await db.collection('events').insertMany(sampleEvents);
      
      console.log('⏰ Creating additional reminders...');
      if (luna && shadow) {
        const remindersWithActualPets = sampleReminders.map((reminder, index) => ({
          ...reminder,
          petId: index % 2 === 0 ? luna._id : shadow._id,
        }));
        await db.collection('healthrecords').insertMany(remindersWithActualPets);
        console.log(`✅ Assigned ${remindersWithActualPets.filter(r => r.petId.equals(luna._id)).length} reminders to Luna`);
        console.log(`✅ Assigned ${remindersWithActualPets.filter(r => r.petId.equals(shadow._id)).length} reminders to Shadow`);
      }

      return {
        message: 'Database seeded successfully!',
        summary: {
          users: sampleUsers.length,
          pets: samplePets.length,
          healthRecords: sampleHealthRecords.length + sampleReminders.length,
          medications: sampleMedications.length,
          notifications: sampleNotifications.length,
          events: sampleEvents.length,
          reminders: sampleReminders.length,
        },
      };
    } catch (error) {
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }
}
