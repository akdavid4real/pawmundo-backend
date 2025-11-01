import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { sampleUsers, samplePets, sampleHealthRecords, sampleMedications, sampleNotifications } from './index';
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
      await this.userModel.deleteMany({});
      await db.collection('pets').deleteMany({});
      await db.collection('healthrecords').deleteMany({});
      await db.collection('medications').deleteMany({});
      await db.collection('notifications').deleteMany({});

      // Create users
      await this.userModel.insertMany(sampleUsers);

      await db.collection('pets').insertMany(samplePets);
      await db.collection('healthrecords').insertMany(sampleHealthRecords);
      await db.collection('medications').insertMany(sampleMedications);
      await db.collection('notifications').insertMany(sampleNotifications);

      return {
        message: 'Database seeded successfully!',
        summary: {
          users: sampleUsers.length,
          pets: samplePets.length,
          healthRecords: sampleHealthRecords.length,
          medications: sampleMedications.length,
          notifications: sampleNotifications.length,
        },
      };
    } catch (error) {
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }
}
