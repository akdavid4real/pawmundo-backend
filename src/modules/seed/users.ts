import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

const sampleUsers = [
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
  }
];

export { sampleUsers };