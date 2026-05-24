import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityType } from '@prisma/client';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class ActivityTrackingService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  private mapActivityType(type: string): ActivityType {
    return (type === 'other' ? 'activity_other' : type) as ActivityType;
  }

  async create(createActivityDto: CreateActivityDto, userId: string) {
    await this.petsService.findById(createActivityDto.petId, userId);

    return this.prisma.activity.create({
      data: {
        ...createActivityDto,
        type: this.mapActivityType(createActivityDto.type),
        date: new Date(createActivityDto.date),
      },
    });
  }

  async findByPet(petId: string, userId: string, type?: string) {
    await this.petsService.findById(petId, userId);

    const where: any = { petId, isActive: true };
    if (type) where.type = this.mapActivityType(type);

    return this.prisma.activity.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string, userId?: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { pet: { select: { ownerId: true } } },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID '${id}' not found`);
    }
    if (userId && activity.pet.ownerId !== userId) {
      throw new ForbiddenException(`You do not have permission to access this activity`);
    }

    return activity;
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.activity.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDailyStats(petId: string, userId: string, date: string) {
    await this.petsService.findById(petId, userId);

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const activities = await this.prisma.activity.findMany({
      where: {
        petId,
        date: { gte: startDate, lte: endDate },
        isActive: true,
      },
    });

    return {
      totalWalks: activities.filter(a => a.type === 'walk').length,
      totalDistance: activities.filter(a => a.type === 'walk').reduce((sum, a) => sum + (a.distance || 0), 0),
      totalFeedings: activities.filter(a => a.type === 'feeding').length,
      totalFoodAmount: activities.filter(a => a.type === 'feeding').reduce((sum, a) => sum + (a.foodAmount || 0), 0),
      totalWaterIntake: activities.filter(a => a.type === 'water').reduce((sum, a) => sum + (a.waterAmount || 0), 0),
      activities,
    };
  }
}
