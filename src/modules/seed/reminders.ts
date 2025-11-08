import { Types } from 'mongoose';

const userId = new Types.ObjectId('507f1f77bcf86cd799439011');
const petIds = [
  new Types.ObjectId('690582532c8149e4fd0d51bc'),
  new Types.ObjectId('690582532c8149e4fd0d51bd'),
];

export const sampleReminders = [
  // Overdue reminders
  {
    _id: new Types.ObjectId(),
    petId: petIds[0],
    type: 'vaccination',
    title: 'Rabies Vaccination',
    description: 'Annual rabies vaccination is due',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    nextDueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    veterinarian: 'Dr. Sarah Johnson',
    clinic: 'Happy Paws Veterinary Clinic',
    isReminder: true,
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    _id: new Types.ObjectId(),
    petId: petIds[1],
    type: 'checkup',
    title: 'Annual Health Checkup',
    description: 'Yearly comprehensive health examination',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    nextDueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    veterinarian: 'Dr. Michael Chen',
    clinic: 'City Animal Hospital',
    isReminder: true,
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    _id: new Types.ObjectId(),
    petId: petIds[0],
    type: 'medication',
    title: 'Heartworm Prevention',
    description: 'Monthly heartworm preventive medication',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    nextDueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isReminder: true,
    isActive: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  // Upcoming reminders
  {
    _id: new Types.ObjectId(),
    petId: petIds[1],
    type: 'grooming',
    title: 'Grooming Session',
    description: 'Regular grooming and nail trimming',
    date: new Date(),
    nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    clinic: 'Pampered Pets Spa',
    isReminder: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    petId: petIds[0],
    type: 'vaccination',
    title: 'DHPP Booster',
    description: 'Distemper, Hepatitis, Parvovirus, Parainfluenza booster',
    date: new Date(),
    nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    veterinarian: 'Dr. Sarah Johnson',
    clinic: 'Happy Paws Veterinary Clinic',
    isReminder: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    petId: petIds[1],
    type: 'checkup',
    title: 'Dental Checkup',
    description: 'Routine dental examination',
    date: new Date(),
    nextDueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    veterinarian: 'Dr. Emily Rodriguez',
    clinic: 'Pet Dental Care Center',
    isReminder: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
