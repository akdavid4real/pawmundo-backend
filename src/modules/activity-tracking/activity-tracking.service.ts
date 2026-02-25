import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@modules/prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivityTrackingService {
  constructor(private prisma: PrismaService) { }

  async create(createActivityDto: CreateActivityDto, userId: string) {
    return this.prisma.activity.create({
      data: {
        ...createActivityDto,
        type: createActivityDto.type as ActivityType,
        date: new Date(createActivityDto.date),
      },
    });
  }

  async findByPet(petId: string, type?: string) {
    const where: any = { petId, isActive: true };
    if (type) where.type = type as ActivityType;

    return this.prisma.activity.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID '${id}' not found`);
    }
    return activity;
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.activity.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getDailyStats(petId: string, date: string) {
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