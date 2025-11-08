import { Types } from 'mongoose';
declare const akdavidUserId: Types.ObjectId;
declare const sampleUsers: {
    _id: Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    isActive: boolean;
    isEmailVerified: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}[];
export { sampleUsers, akdavidUserId };
