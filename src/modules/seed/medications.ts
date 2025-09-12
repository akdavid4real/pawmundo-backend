import { Types } from 'mongoose';
import { samplePets } from './pets';

export const sampleMedications = [
  // Buddy's medications
  {
    _id: new Types.ObjectId(),
    petId: samplePets[0]._id,
    name: 'Heartgard Plus',
    dosage: '1 tablet',
    frequency: 'monthly',
    startDate: new Date('2024-01-01'),
    instructions: 'Give with food on the same date each month',
    veterinarian: 'Dr. Emily Johnson',
    isActive: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    petId: samplePets[0]._id,
    name: 'Antibiotic Ear Drops',
    dosage: '3 drops per ear',
    frequency: 'daily',
    startDate: new Date('2023-11-20'),
    endDate: new Date('2023-12-05'),
    instructions: 'Apply twice daily for 14 days',
    veterinarian: 'Dr. Michael Brown',
    isActive: false,
    isCompleted: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Max's medications
  {
    _id: new Types.ObjectId(),
    petId: samplePets[2]._id,
    name: 'Glucosamine Supplement',
    dosage: '2 tablets',
    frequency: 'daily',
    startDate: new Date('2024-01-20'),
    instructions: 'Give with morning meal',
    veterinarian: 'Dr. Robert Davis',
    isActive: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    petId: samplePets[2]._id,
    name: 'Carprofen',
    dosage: '75mg',
    frequency: 'daily',
    startDate: new Date('2024-01-20'),
    instructions: 'Give with food. Monitor for stomach upset.',
    veterinarian: 'Dr. Robert Davis',
    isActive: true,
    isCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = { sampleMedications };