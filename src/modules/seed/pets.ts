import { Types } from 'mongoose';
import { sampleUsers } from './users';

export const samplePets = [
  {
    _id: new Types.ObjectId(),
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    weight: 30.5,
    color: 'Golden',
    microchipId: 'MC123456789',
    ownerId: sampleUsers[0]._id,
    dateOfBirth: new Date('2021-03-15'),
    medicalNotes: 'Allergic to chicken. Prone to hip dysplasia.',
    emergencyContactName: 'Sarah Doe',
    emergencyContactPhone: '+1234567891',
    healthStatus: 'healthy',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    name: 'Whiskers',
    species: 'Cat',
    breed: 'Persian',
    age: 5,
    gender: 'Female',
    weight: 4.2,
    color: 'White',
    microchipId: 'MC987654321',
    ownerId: sampleUsers[1]._id,
    dateOfBirth: new Date('2019-07-22'),
    medicalNotes: 'Indoor cat. Regular grooming required.',
    emergencyContactName: 'Mike Smith',
    emergencyContactPhone: '+1987654322',
    healthStatus: 'healthy',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 7,
    gender: 'Male',
    weight: 35.0,
    color: 'Black and Tan',
    microchipId: 'MC456789123',
    ownerId: sampleUsers[0]._id,
    dateOfBirth: new Date('2017-01-10'),
    medicalNotes: 'Senior dog. Arthritis in hind legs.',
    emergencyContactName: 'Sarah Doe',
    emergencyContactPhone: '+1234567891',
    healthStatus: 'chronic',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = { samplePets };