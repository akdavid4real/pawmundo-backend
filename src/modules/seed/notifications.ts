import { Types } from 'mongoose';
import { akdavidUserId } from './users';

const sampleNotifications = [
  {
    _id: new Types.ObjectId(),
    userId: akdavidUserId,
    title: 'Vaccination Due',
    message: 'Max is due for his annual rabies vaccination next week.',
    type: 'vaccination',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    userId: akdavidUserId,
    title: 'Appointment Reminder',
    message: 'You have a vet appointment tomorrow at 2:00 PM.',
    type: 'appointment',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    userId: akdavidUserId,
    title: 'Medication Reminder',
    message: 'Time to give Bella her heartworm medication.',
    type: 'medication',
    isRead: true,
    isActive: true,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000)
  },
  {
    _id: new Types.ObjectId(),
    userId: akdavidUserId,
    title: 'Health Checkup',
    message: 'Luna is due for her 6-month health checkup.',
    type: 'checkup',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: new Types.ObjectId(),
    userId: akdavidUserId,
    title: 'Weight Alert',
    message: 'Max has gained 2 lbs since last checkup. Consider adjusting diet.',
    type: 'weight',
    isRead: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export { sampleNotifications };
