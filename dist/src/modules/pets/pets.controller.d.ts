import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(req: any, createPetDto: CreatePetDto): Promise<import("./schemas/pet.schema").Pet>;
    findMyPets(req: any, species?: string): Promise<import("./schemas/pet.schema").Pet[]>;
    findOne(id: string, req: any): Promise<import("./schemas/pet.schema").Pet>;
    update(id: string, updatePetDto: UpdatePetDto, req: any): Promise<import("./schemas/pet.schema").Pet>;
    updateHealthStatus(id: string, status: string, req: any): Promise<import("./schemas/pet.schema").Pet>;
    remove(id: string, req: any): Promise<import("./schemas/pet.schema").Pet>;
}
