import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Medication, MedicationDocument } from './schemas/medication.schema';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { PetsService } from '../pets/pets.service';
import { ValidationUtil } from '../../common/utils/validation.util';
import { DatabaseErrorHandler } from '../../common/utils/database-error.handler';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectModel(Medication.name) private medicationModel: Model<MedicationDocument>,
    private petsService: PetsService,
  ) {}

  async create(userId: string, createMedicationDto: CreateMedicationDto): Promise<Medication> {
    try {
      ValidationUtil.validateObjectId(createMedicationDto.petId, 'Pet ID');
      
      await this.petsService.findById(createMedicationDto.petId, userId);

      const medicationData = {
        ...createMedicationDto,
        petId: new Types.ObjectId(createMedicationDto.petId),
        startDate: ValidationUtil.validateDate(createMedicationDto.startDate, 'start date'),
        endDate: ValidationUtil.validateOptionalDate(createMedicationDto.endDate, 'end date'),
      };

      const medication = new this.medicationModel(medicationData);
      return await medication.save();
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Create medication');
    }
  }

  async findByPet(petId: string, userId: string): Promise<Medication[]> {
    try {
      ValidationUtil.validateObjectId(petId, 'Pet ID');
      await this.petsService.findById(petId, userId);
      
      return this.medicationModel.find({ petId, isActive: true }).sort({ startDate: -1 });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Find medications by pet');
    }
  }

  async findActive(userId: string): Promise<Medication[]> {
    try {
      const userPets = await this.petsService.findByOwner(userId);
      const petIds = userPets.map(pet => pet._id);
      
      return this.medicationModel.find({
        petId: { $in: petIds },
        isActive: true,
        isCompleted: false,
        $or: [
          { endDate: { $exists: false } },
          { endDate: { $gte: new Date() } }
        ]
      }).populate('petId', 'name species').sort({ startDate: -1 });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Find active medications');
    }
  }

  async findById(id: string, userId: string): Promise<Medication> {
    try {
      ValidationUtil.validateObjectId(id, 'Medication ID');
      
      const medication = await this.medicationModel.findById(id).populate('petId');
      if (!medication) {
        throw new NotFoundException(`Medication with ID '${id}' does not exist`);
      }

      await this.petsService.findById(medication.petId.toString(), userId);
      return medication;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      DatabaseErrorHandler.handle(error, 'Find medication by ID');
    }
  }

  async update(id: string, userId: string, updateMedicationDto: UpdateMedicationDto): Promise<Medication> {
    try {
      await this.findById(id, userId);

      const updateData: any = { ...updateMedicationDto };
      if (updateMedicationDto.startDate) {
        updateData.startDate = ValidationUtil.validateDate(updateMedicationDto.startDate, 'start date');
      }
      if (updateMedicationDto.endDate) {
        updateData.endDate = ValidationUtil.validateDate(updateMedicationDto.endDate, 'end date');
      }

      return this.medicationModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Update medication');
    }
  }

  async delete(id: string, userId: string): Promise<Medication> {
    try {
      await this.findById(id, userId);
      return this.medicationModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Delete medication');
    }
  }

  async markCompleted(id: string, userId: string): Promise<Medication> {
    try {
      await this.findById(id, userId);
      return this.medicationModel.findByIdAndUpdate(id, { isCompleted: true }, { new: true });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Mark medication completed');
    }
  }
}