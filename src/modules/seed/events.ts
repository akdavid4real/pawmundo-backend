import { Types } from 'mongoose';

const userId = new Types.ObjectId('507f1f77bcf86cd799439011');
const petIds = [
  new Types.ObjectId('690582532c8149e4fd0d51bc'),
  new Types.ObjectId('690582532c8149e4fd0d51bd'),
];

export const sampleEvents = [
  // Upcoming events
  {
    _id: new Types.ObjectId(),
    userId,
    petId: petIds[0],
    title: 'Annual Checkup',
    description: 'Yearly health examination and vaccinations',
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    eventTime: '10:00 AM',
    location: 'Happy Paws Veterinary Clinic',
    category: 'checkup',
    status: 'scheduled',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    userId,
    petId: petIds[1],
    title: 'Grooming Appointment',
    description: 'Full grooming service including bath and nail trim',
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    eventTime: '2:30 PM',
    location: 'Pampered Pets Spa',
    category: 'grooming',
    status: 'scheduled',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new Types.ObjectId(),
    userId,
    petId: petIds[0],
    title: 'Vaccination Booster',
    description: 'Rabies and DHPP booster shots',
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    eventTime: '11:30 AM',
    location: 'City Animal Hospital',
    category: 'vaccination',
    status: 'scheduled',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Past events
  {
    _id: new Types.ObjectId(),
    userId,
    petId: petIds[0],
    title: 'Dental Cleaning',
    description: 'Professional teeth cleaning',
    eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    eventTime: '9:00 AM',
    location: 'Pet Dental Care Center',
    category: 'checkup',
    status: 'completed',
    isActive: true,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
];
