import { Model } from 'mongoose';
import { Pet } from '../pets/schemas/pet.schema';
import { HealthRecord } from '../health-records/schemas/health-record.schema';
import { Medication } from '../medications/schemas/medication.schema';
import { SymptomCheckDto } from './dto/symptom-check.dto';
import { User } from '../auth/schemas/user.schema';
import { SymptomCheck } from './schemas/symptom-check.schema';
export declare class SymptomCheckerService {
    private petModel;
    private healthRecordModel;
    private medicationModel;
    private userModel;
    private symptomCheckModel;
    constructor(petModel: Model<Pet>, healthRecordModel: Model<HealthRecord>, medicationModel: Model<Medication>, userModel: Model<User>, symptomCheckModel: Model<SymptomCheck>);
    extractPetContext(userId: string, message: string): Promise<string>;
    private findMentionedPets;
    private getPetDetailedContext;
    checkSymptoms(userId: string, symptomCheckDto: SymptomCheckDto): Promise<{
        petInfo: {
            name: string;
            species: string;
            breed: string;
            age: number;
        };
        analysis: any;
        timestamp: Date;
    }>;
    private buildPetContext;
    private callMistralAI;
    getHistory(userId: string): Promise<(import("mongoose").Document<unknown, {}, SymptomCheck, {}, {}> & SymptomCheck & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    chatWithAI(userId: string, message: string): Promise<string>;
}
