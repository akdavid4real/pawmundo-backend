import { Document, Types } from 'mongoose';
export declare class Pet extends Document {
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    weight: number;
    color: string;
    profileImage: string;
    ownerId: Types.ObjectId;
    dateOfBirth: Date;
    medicalNotes: string;
    allergies: string[];
    pastIllnesses: string[];
    surgeries: string[];
    dietaryPreferences: string;
    dietaryRestrictions: string[];
    behavioralNotes: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    healthStatus: string;
    isActive: boolean;
}
export declare const PetSchema: import("mongoose").Schema<Pet, import("mongoose").Model<Pet, any, any, any, Document<unknown, any, Pet, any, {}> & Pet & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Pet, Document<unknown, {}, import("mongoose").FlatRecord<Pet>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Pet> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
