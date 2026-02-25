import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { PetsService } from '../pets/pets.service';
import { ValidationUtil } from '../../common/utils/validation.util';
import { DatabaseErrorHandler } from '../../common/utils/database-error.handler';
import { MedicationFrequency } from '@prisma/client';

@Injectable()
export class MedicationsService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  async create(userId: string, createMedicationDto: CreateMedicationDto) {
    try {
      await this.petsService.findById(createMedicationDto.petId, userId);

      return await this.prisma.medication.create({
        data: {
          ...createMedicationDto,
          frequency: createMedicationDto.frequency as MedicationFrequency,
          startDate: ValidationUtil.validateDate(createMedicationDto.startDate, 'start date'),
          endDate: ValidationUtil.validateOptionalDate(createMedicationDto.endDate, 'end date'),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      DatabaseErrorHandler.handle(error, 'Create medication');
    }
  }

  async findByPet(petId: string, userId: string) {
    try {
      await this.petsService.findById(petId, userId);
      return this.prisma.medication.findMany({
        where: { petId, isActive: true },
        orderBy: { startDate: 'desc' },
      });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Find medications by pet');
    }
  }

  async findActive(userId: string) {
    try {
      const userPets = await this.petsService.findByOwner(userId);
      const petIds = userPets.map(pet => pet.id);

      return this.prisma.medication.findMany({
        where: {
          petId: { in: petIds },
          isActive: true,
          isCompleted: false,
          OR: [
            { endDate: null },
            { endDate: { gte: new Date() } },
          ],
        },
        include: { pet: { select: { name: true, species: true } } },
        orderBy: { startDate: 'desc' },
      });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Find active medications');
    }
  }

  async findById(id: string, userId: string) {
    try {
      const medication = await this.prisma.medication.findUnique({
        where: { id },
        include: { pet: true },
      });
      if (!medication) {
        throw new NotFoundException(`Medication with ID '${id}' does not exist`);
      }
      await this.petsService.findById(medication.petId, userId);
      return medication;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      DatabaseErrorHandler.handle(error, 'Find medication by ID');
    }
  }

  async update(id: string, userId: string, updateMedicationDto: UpdateMedicationDto) {
    try {
      await this.findById(id, userId);

      const updateData: any = { ...updateMedicationDto };
      if (updateMedicationDto.startDate) {
        updateData.startDate = ValidationUtil.validateDate(updateMedicationDto.startDate, 'start date');
      }
      if (updateMedicationDto.endDate) {
        updateData.endDate = ValidationUtil.validateDate(updateMedicationDto.endDate, 'end date');
      }

      return this.prisma.medication.update({ where: { id }, data: updateData });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Update medication');
    }
  }

  async delete(id: string, userId: string) {
    try {
      await this.findById(id, userId);
      return this.prisma.medication.update({ where: { id }, data: { isActive: false } });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Delete medication');
    }
  }

  async markCompleted(id: string, userId: string) {
    try {
      await this.findById(id, userId);
      return this.prisma.medication.update({ where: { id }, data: { isCompleted: true } });
    } catch (error) {
      DatabaseErrorHandler.handle(error, 'Mark medication completed');
    }
  }
}