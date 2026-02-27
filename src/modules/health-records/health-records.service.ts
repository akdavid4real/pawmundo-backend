import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class HealthRecordsService {
  constructor(
    private prisma: PrismaService,
    private petsService: PetsService,
  ) { }

  async create(userId: string, recordData: any) {
    try {
      if (recordData.petId) {
        await this.petsService.findById(recordData.petId, userId);
      }
      return await this.prisma.healthRecord.create({ data: recordData });
    } catch (error) {
      console.error('Error creating health record:', error);
      throw error;
    }
  }

  async findByPet(petId: string, userId: string, type?: string) {
    await this.petsService.findById(petId, userId);
    return this.prisma.healthRecord.findMany({
      where: {
        petId,
        isActive: true,
        ...(type ? { type } : {}),
      },
      orderBy: { date: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const record = await this.prisma.healthRecord.findFirst({
      where: { id, isActive: true },
      include: {
        pet: {
          select: { id: true, name: true, species: true, breed: true, ownerId: true, isActive: true },
        },
      },
    });
    if (!record || !record.pet || record.pet.ownerId !== userId || !record.pet.isActive) {
      throw new NotFoundException(`Health record with ID '${id}' does not exist or you don't have permission to access it`);
    }
    return record;
  }

  async update(id: string, userId: string, updateData: any) {
    await this.findById(id, userId);
    return this.prisma.healthRecord.update({ where: { id }, data: updateData });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return this.prisma.healthRecord.update({ where: { id }, data: { isActive: false } });
  }

  async getUpcomingReminders(userId: string) {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const records = await this.prisma.healthRecord.findMany({
      where: {
        nextDueDate: { gte: today, lte: nextMonth },
        isReminder: true,
        isActive: true,
        pet: { ownerId: userId, isActive: true },
      },
      include: { pet: { select: { name: true, species: true, breed: true } } },
      orderBy: { nextDueDate: 'asc' },
    });
    return records;
  }

  async getVaccinations(petId: string, userId: string) {
    await this.petsService.findById(petId, userId);
    return this.prisma.healthRecord.findMany({
      where: { petId, type: 'vaccination', isActive: true },
      orderBy: { date: 'desc' },
    });
  }

  async getHealthSummary(petId: string, userId: string) {
    const [pet, records] = await Promise.all([
      this.petsService.findById(petId, userId),
      this.prisma.healthRecord.findMany({
        where: { petId, isActive: true },
        orderBy: { date: 'desc' },
      }),
    ]);

    const now = new Date();
    let upcomingCount = 0, overdueCount = 0, totalCost = 0;
    let nextReminder: Date | undefined;
    const recordsByType: Record<string, number> = {};
    const weightHistory: { date: Date; weight: number }[] = [];
    let lastCheckup: Date | undefined;

    for (const record of records) {
      recordsByType[record.type] = (recordsByType[record.type] || 0) + 1;
      totalCost += record.cost || 0;

      if (record.type === 'checkup' && !lastCheckup) lastCheckup = record.date;
      if (record.weight) weightHistory.push({ date: record.date, weight: record.weight });

      if (record.nextDueDate) {
        if (record.nextDueDate > now) {
          upcomingCount++;
          if (!nextReminder || record.nextDueDate < nextReminder) {
            nextReminder = record.nextDueDate;
          }
        } else {
          overdueCount++;
        }
      }
    }

    return {
      totalRecords: records.length,
      recordsByType,
      lastCheckup,
      nextReminder,
      upcomingCount,
      overdueCount,
      totalCost,
      weightHistory: weightHistory.sort((a, b) => a.date.getTime() - b.date.getTime()),
    };
  }

  async getOverdueReminders(userId: string) {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return this.prisma.healthRecord.findMany({
      where: {
        nextDueDate: { lt: today, gte: sevenDaysAgo },
        isReminder: true,
        isActive: true,
        pet: { ownerId: userId, isActive: true },
      },
      include: { pet: { select: { name: true, species: true, breed: true } } },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async addAttachment(recordId: string, userId: string, attachmentUrl: string) {
    const record = await this.findById(recordId, userId);
    const currentAttachments = record.attachments || [];
    return this.prisma.healthRecord.update({
      where: { id: recordId },
      data: { attachments: [...currentAttachments, attachmentUrl] },
    });
  }

  async removeAttachment(recordId: string, userId: string, attachmentUrl: string) {
    const record = await this.findById(recordId, userId);
    const currentAttachments = record.attachments || [];
    return this.prisma.healthRecord.update({
      where: { id: recordId },
      data: { attachments: currentAttachments.filter(a => a !== attachmentUrl) },
    });
  }

  async getRecordsByDateRange(petId: string, userId: string, startDate: Date, endDate: Date) {
    await this.petsService.findById(petId, userId);
    return this.prisma.healthRecord.findMany({
      where: {
        petId,
        date: { gte: startDate, lte: endDate },
        isActive: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getHealthAnalytics(userId: string) {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), 0, 1);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [userPets, records] = await Promise.all([
      this.petsService.findByOwner(userId),
      this.prisma.healthRecord.findMany({
        where: {
          isActive: true,
          pet: { ownerId: userId, isActive: true },
        },
      }),
    ]);

    let totalSpent = 0, spentThisYear = 0, upcomingCount = 0;
    const recordsByMonth = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
    const typeCounts: Record<string, number> = {};
    const thisYearRecords: any[] = [];

    for (const record of records) {
      totalSpent += record.cost || 0;
      typeCounts[record.type] = (typeCounts[record.type] || 0) + 1;

      if (record.date >= thisYear) {
        thisYearRecords.push(record);
        spentThisYear += record.cost || 0;
        recordsByMonth[record.date.getMonth()].count++;
      }

      if (record.nextDueDate && record.nextDueDate > now && record.nextDueDate <= nextMonth) {
        upcomingCount++;
      }
    }

    const mostCommonType = Object.entries(typeCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || null;

    return {
      totalPets: userPets.length,
      totalRecords: records.length,
      recordsThisYear: thisYearRecords.length,
      upcomingReminders: upcomingCount,
      totalSpent,
      spentThisYear,
      recordsByMonth,
      mostCommonType,
    };
  }
}