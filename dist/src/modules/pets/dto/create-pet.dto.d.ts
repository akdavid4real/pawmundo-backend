export declare class CreatePetDto {
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    weight?: number;
    color?: string;
    profileImage?: string;
    dateOfBirth?: string;
    medicalNotes?: string;
    allergies?: string[];
    pastIllnesses?: string[];
    surgeries?: string[];
    dietaryPreferences?: string;
    dietaryRestrictions?: string[];
    behavioralNotes?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}
