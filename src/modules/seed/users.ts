import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

const akdavidUserId = new Types.ObjectId('507f1f77bcf86cd799439011');

const sampleUsers = [
  {
    _id: akdavidUserId,
    email: 'akdavid4real@gmail.com',
    password: bcrypt.hashSync('Shadowfight@2', 12),
    firstName: 'David',
    lastName: 'Ak',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    isActive: true,
    isEmailVerified: true,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    email: 'john.doe@example.com',
    password: bcrypt.hashSync('password123', 12),
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    isActive: true,
    isEmailVerified: true,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    email: 'jane.smith@example.com',
    password: bcrypt.hashSync('password123', 12),
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    address: '456 Oak Ave, City, State 67890',
    isActive: true,
    isEmailVerified: true,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    email: 'dr.sarah@vetclinic.com',
    password: bcrypt.hashSync('VetPass123', 12),
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    phone: '+1555123456',
    address: '789 Vet Clinic Rd, City, State 11111',
    isActive: true,
    isEmailVerified: true,
    role: 'vet',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    email: 'dr.mike@petcare.com',
    password: bcrypt.hashSync('VetPass123', 12),
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    phone: '+1555789012',
    address: '321 Pet Care Blvd, City, State 22222',
    isActive: true,
    isEmailVerified: true,
    role: 'vet',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export { sampleUsers, akdavidUserId };

