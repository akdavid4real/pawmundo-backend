import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HealthRecord } from './schemas/health-record.schema';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class HealthRecordsService {
  constructor(
    @InjectModel(HealthRecord.name) private healthRecordModel: Model<HealthRecord>,
    private petsService: PetsService,
  ) {}

  async create(userId: string, recordData: Partial<HealthRecord>): Promise<HealthRecord> {
    try {
      const petIdStr = recordData.petId?.toString();
      if (petIdStr) {
        await this.petsService.findById(petIdStr, userId);
      }
      const record = new this.healthRecordModel(recordData);
      return await record.save();
    } catch (error) {
      console.error('Error creating health record:', error);
      throw error;
    }
  }

  async findByPet(petId: string, userId: string, type?: string): Promise<HealthRecord[]> {
    await this.petsService.findById(petId, userId);
    const filter: any = { petId, isActive: true };
    if (type) filter.type = type;
    return this.healthRecordModel.find(filter).sort({ date: -1 }).exec();
  }

  async findById(id: string, userId: string): Promise<HealthRecord> {
    const record = await this.healthRecordModel.findById(id).populate({
      path: 'petId',
      match: { ownerId: userId, isActive: true }
    }).exec();
    if (!record || !record.petId) throw new NotFoundException(`Health record with ID '${id}' does not exist or you don't have permission to access it`);
    return record;
  }

  async update(id: string, userId: string, updateData: Partial<HealthRecord>): Promise<HealthRecord> {
    await this.findById(id, userId);
    return this.healthRecordModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string, userId: string): Promise<HealthRecord> {
    await this.findById(id, userId);
    return this.healthRecordModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async getUpcomingReminders(userId: string): Promise<HealthRecord[]> {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const { Types } = require('mongoose');
    
    return this.healthRecordModel
      .find({
        nextDueDate: { $gte: today, $lte: nextMonth },
        isReminder: true,
        isActive: true
      })
      .populate({
        path: 'petId',
        match: { ownerId: new Types.ObjectId(userId), isActive: true },
        select: 'name species breed'
      })
      .sort({ nextDueDate: 1 })
      .exec()
      .then(records => records.filter(r => r.petId));
  }

  async getVaccinations(petId: string, userId: string): Promise<HealthRecord[]> {
    await this.petsService.findById(petId, userId);
    return this.healthRecordModel
      .find({ petId, type: 'vaccination', isActive: true })
      .sort({ date: -1 })
      .exec();
  }

  async getHealthSummary(petId: string, userId: string) {
    const [pet, records] = await Promise.all([
      this.petsService.findById(petId, userId),
      this.healthRecordModel.find({ petId, isActive: true }).sort({ date: -1 }).exec()
    ]);
    
    const now = new Date();
    let upcomingCount = 0, overdueCount = 0, totalCost = 0;
    let nextReminder: Date | undefined;
    const recordsByType = {};
    const weightHistory = [];
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
      weightHistory: weightHistory.sort((a, b) => a.date.getTime() - b.date.getTime())
    };
  }

  async getOverdueReminders(userId: string): Promise<HealthRecord[]> {
    const today = new Date();
    const { Types } = require('mongoose');
    
    return this.healthRecordModel
      .find({
        nextDueDate: { $lt: today },
        isReminder: true,
        isActive: true
      })
      .populate({
        path: 'petId',
        match: { ownerId: new Types.ObjectId(userId), isActive: true },
        select: 'name species breed'
      })
      .sort({ nextDueDate: 1 })
      .exec()
      .then(records => records.filter(r => r.petId));
  }

  async addAttachment(recordId: string, userId: string, attachmentUrl: string): Promise<HealthRecord> {
    const record = await this.findById(recordId, userId);
    return this.healthRecordModel
      .findByIdAndUpdate(
        recordId,
        { $push: { attachments: attachmentUrl } },
        { new: true }
      )
      .exec();
  }

  async removeAttachment(recordId: string, userId: string, attachmentUrl: string): Promise<HealthRecord> {
    const record = await this.findById(recordId, userId);
    return this.healthRecordModel
      .findByIdAndUpdate(
        recordId,
        { $pull: { attachments: attachmentUrl } },
        { new: true }
      )
      .exec();
  }

  async getRecordsByDateRange(petId: string, userId: string, startDate: Date, endDate: Date): Promise<HealthRecord[]> {
    await this.petsService.findById(petId, userId);
    return this.healthRecordModel
      .find({
        petId,
        date: { $gte: startDate, $lte: endDate },
        isActive: true
      })
      .sort({ date: -1 })
      .exec();
  }

  async getHealthAnalytics(userId: string) {
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), 0, 1);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const [userPets, records] = await Promise.all([
      this.petsService.findByOwner(userId),
      this.healthRecordModel.find({
        isActive: true
      }).populate({
        path: 'petId',
        match: { ownerId: userId, isActive: true }
      }).exec().then(records => records.filter(r => r.petId))
    ]);
    
    let totalSpent = 0, spentThisYear = 0, upcomingCount = 0;
    const recordsByMonth = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
    const typeCounts = {};
    const thisYearRecords = [];
    
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
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || null;
    
    return {
      totalPets: userPets.length,
      totalRecords: records.length,
      recordsThisYear: thisYearRecords.length,
      upcomingReminders: upcomingCount,
      totalSpent,
      spentThisYear,
      recordsByMonth,
      mostCommonType
    };
  }


}