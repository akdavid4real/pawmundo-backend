import { Model } from 'mongoose';
import { Pet } from './schemas/pet.schema';
export declare class PetsService {
    private petModel;
    constructor(petModel: Model<Pet>);
    create(petData: Partial<Pet>): Promise<Pet>;
    findByOwner(ownerId: string, species?: string): Promise<Pet[]>;
    findById(id: string, ownerId?: string): Promise<Pet>;
    update(id: string, ownerId: string, updateData: Partial<Pet>): Promise<Pet>;
    delete(id: string, ownerId: string): Promise<Pet>;
    updateHealthStatus(id: string, ownerId: string, status: string): Promise<Pet>;
    findByHealthStatus(ownerId: string, status: string): Promise<Pet[]>;
    findByName(ownerId: string, name: string): Promise<Pet | null>;
}
