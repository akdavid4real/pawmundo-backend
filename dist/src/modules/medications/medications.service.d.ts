import { Model } from 'mongoose';
import { Medication, MedicationDocument } from './schemas/medication.schema';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { PetsService } from '../pets/pets.service';
export declare class MedicationsService {
    private medicationModel;
    private petsService;
    constructor(medicationModel: Model<MedicationDocument>, petsService: PetsService);
    create(userId: string, createMedicationDto: CreateMedicationDto): Promise<Medication>;
    findByPet(petId: string, userId: string): Promise<Medication[]>;
    findActive(userId: string): Promise<Medication[]>;
    findById(id: string, userId: string): Promise<Medication>;
    update(id: string, userId: string, updateMedicationDto: UpdateMedicationDto): Promise<Medication>;
    delete(id: string, userId: string): Promise<Medication>;
    markCompleted(id: string, userId: string): Promise<Medication>;
}
