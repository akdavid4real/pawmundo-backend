import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
export declare class MedicationsController {
    private readonly medicationsService;
    constructor(medicationsService: MedicationsService);
    create(req: any, createMedicationDto: CreateMedicationDto): Promise<import("./schemas/medication.schema").Medication>;
    findActive(req: any): Promise<import("./schemas/medication.schema").Medication[]>;
    findByPet(petId: string, req: any): Promise<import("./schemas/medication.schema").Medication[]>;
    findOne(id: string, req: any): Promise<import("./schemas/medication.schema").Medication>;
    update(id: string, req: any, updateMedicationDto: UpdateMedicationDto): Promise<import("./schemas/medication.schema").Medication>;
    markCompleted(id: string, req: any): Promise<import("./schemas/medication.schema").Medication>;
    remove(id: string, req: any): Promise<import("./schemas/medication.schema").Medication>;
}
