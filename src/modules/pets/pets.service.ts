import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pet } from './schemas/pet.schema';

@Injectable()
export class PetsService {
  constructor(@InjectModel(Pet.name) private petModel: Model<Pet>) {}

  async create(petData: Partial<Pet>): Promise<Pet> {
    const pet = new this.petModel(petData);
    return pet.save();
  }

  async findByOwner(ownerId: string, species?: string): Promise<Pet[]> {
    const filter: any = { ownerId, isActive: true };
    if (species) filter.species = species;
    return this.petModel.find(filter).sort({ name: 1 }).exec();
  }

  async findById(id: string, ownerId?: string): Promise<Pet> {
    const pet = await this.petModel.findById(id).exec();
    if (!pet) {
      throw new NotFoundException(`Pet with ID '${id}' does not exist`);
    }

    // If ownerId is provided, verify ownership
    if (ownerId && !pet.ownerId.equals(ownerId)) {
      throw new ForbiddenException(`Access denied`);
    }

    return pet;
  }

  async update(id: string, ownerId: string, updateData: Partial<Pet>): Promise<Pet> {
    await this.findById(id, ownerId);
    return this.petModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string, ownerId: string): Promise<Pet> {
    await this.findById(id, ownerId);
    return this.petModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async updateHealthStatus(id: string, ownerId: string, status: string): Promise<Pet> {
    await this.findById(id, ownerId);
    const validStatuses = ['healthy', 'sick', 'recovering', 'chronic'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid health status '${status}'. Valid options are: ${validStatuses.join(', ')}`);
    }
    return this.petModel.findByIdAndUpdate(id, { healthStatus: status }, { new: true }).exec();
  }

  async findByHealthStatus(ownerId: string, status: string): Promise<Pet[]> {
    return this.petModel.find({ ownerId, healthStatus: status, isActive: true }).exec();
  }
}