import { Injectable } from '@nestjs/common';
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

  async findByOwner(ownerId: string): Promise<Pet[]> {
    return this.petModel.find({ ownerId, isActive: true }).exec();
  }

  async findById(id: string): Promise<Pet> {
    return this.petModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<Pet>): Promise<Pet> {
    return this.petModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<Pet> {
    return this.petModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }
}