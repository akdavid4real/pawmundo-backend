import { Types } from 'mongoose';
import { sampleUsers } from './users';

const lunaId = new Types.ObjectId('690e8da85db702e57de01ff9');
const shadowId = new Types.ObjectId('690e8da85db702e57de01ffa');
const buddyId = new Types.ObjectId('690e8da85db702e57de01ffb');
const whiskersId = new Types.ObjectId('690e8da85db702e57de01ffc');
const maxId = new Types.ObjectId('690e8da85db702e57de01ffd');

export const samplePets = [
  // Pets for akdavid4real@gmail.com
  {
    _id: lunaId,
    name: 'Luna',
    species: 'dog',
    breed: 'Labrador Retriever',
    age: 2,
    gender: 'female',
    weight: 25.0,
    color: 'Black',
    ownerId: sampleUsers[0]._id,
    dateOfBirth: new Date('2022-05-10'),
    medicalNotes: 'Very active and healthy. Loves swimming.',
    emergencyContactName: 'David Ak',
    emergencyContactPhone: '+1234567890',
    healthStatus: 'healthy',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: shadowId,
    name: 'Shadow',
    species: 'cat',
    breed: 'Maine Coon',
    age: 4,
    gender: 'male',
    weight: 6.5,
    color: 'Gray',
    ownerId: sampleUsers[0]._id,
    dateOfBirth: new Date('2020-08-15'),
    medicalNotes: 'Indoor/outdoor cat. Regular flea prevention.',
    emergencyContactName: 'David Ak',
    emergencyContactPhone: '+1234567890',
    healthStatus: 'healthy',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: buddyId,
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    weight: 30.5,
    color: 'Golden',
    ownerId: sampleUsers[1]._id,
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
    _id: whiskersId,
    name: 'Whiskers',
    species: 'cat',
    breed: 'Persian',
    age: 5,
    gender: 'female',
    weight: 4.2,
    color: 'White',
    ownerId: sampleUsers[2]._id,
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
    _id: maxId,
    name: 'Max',
    species: 'dog',
    breed: 'German Shepherd',
    age: 7,
    gender: 'male',
    weight: 35.0,
    color: 'Black and Tan',
    ownerId: sampleUsers[1]._id,
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

export { lunaId, shadowId, buddyId, whiskersId, maxId };
module.exports = { samplePets, lunaId, shadowId, buddyId, whiskersId, maxId };