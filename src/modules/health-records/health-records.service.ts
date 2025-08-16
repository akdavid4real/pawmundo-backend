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
    await this.petsService.findById(recordData.petId.toString(), userId);
    const processedData = {
      ...recordData,
      date: new Date(recordData.date),
      nextDueDate: recordData.nextDueDate ? new Date(recordData.nextDueDate) : undefined
    };
    const record = new this.healthRecordModel(processedData);
    return record.save();
  }

  async findByPet(petId: string, userId: string, type?: string): Promise<HealthRecord[]> {
    await this.petsService.findById(petId, userId);
    const filter: any = { petId, isActive: true };
    if (type) filter.type = type;
    return this.healthRecordModel.find(filter).sort({ date: -1 }).exec();
  }

  async findById(id: string, userId: string): Promise<HealthRecord> {
    const record = await this.healthRecordModel.findById(id).populate('petId').exec();
    if (!record) throw new NotFoundException('Health record not found');
    
    const pet = await this.petsService.findById(record.petId.toString(), userId);
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
    const userPets = await this.petsService.findByOwner(userId);
    const petIds = userPets.map(pet => pet._id);
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return this.healthRecordModel
      .find({
        petId: { $in: petIds },
        nextDueDate: { $gte: today, $lte: nextMonth },
        isActive: true
      })
      .populate('petId', 'name species breed')
      .sort({ nextDueDate: 1 })
      .exec();
  }

  async getVaccinations(petId: string, userId: string): Promise<HealthRecord[]> {
    await this.petsService.findById(petId, userId);
    return this.healthRecordModel
      .find({ petId, type: 'vaccination', isActive: true })
      .sort({ date: -1 })
      .exec();
  }

  async getHealthSummary(petId: string, userId: string) {
    await this.petsService.findById(petId, userId);
    const records = await this.healthRecordModel.find({ petId, isActive: true }).exec();
    const now = new Date();
    
    const upcomingReminders = records.filter(r => r.nextDueDate && r.nextDueDate > now);
    const overdueReminders = records.filter(r => r.nextDueDate && r.nextDueDate < now);
    
    return {
      totalRecords: records.length,
      recordsByType: records.reduce((acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      }, {}),
      lastCheckup: records.find(r => r.type === 'checkup')?.date,
      nextReminder: upcomingReminders.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime())[0]?.nextDueDate,
      upcomingCount: upcomingReminders.length,
      overdueCount: overdueReminders.length,
      totalCost: records.reduce((sum, r) => sum + (r.cost || 0), 0),
      weightHistory: records.filter(r => r.weight).map(r => ({ date: r.date, weight: r.weight })).sort((a, b) => a.date.getTime() - b.date.getTime())
    };
  }

  async getOverdueReminders(userId: string): Promise<HealthRecord[]> {
    const userPets = await this.petsService.findByOwner(userId);
    const petIds = userPets.map(pet => pet._id);
    const today = new Date();
    
    return this.healthRecordModel
      .find({
        petId: { $in: petIds },
        nextDueDate: { $lt: today },
        isActive: true
      })
      .populate('petId', 'name species breed')
      .sort({ nextDueDate: 1 })
      .exec();
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
    const userPets = await this.petsService.findByOwner(userId);
    const petIds = userPets.map(pet => pet._id);
    const records = await this.healthRecordModel.find({ petId: { $in: petIds }, isActive: true }).exec();
    const now = new Date();
    const thisYear = new Date(now.getFullYear(), 0, 1);
    
    const thisYearRecords = records.filter(r => r.date >= thisYear);
    const upcomingReminders = records.filter(r => r.nextDueDate && r.nextDueDate > now && r.nextDueDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
    
    return {
      totalPets: userPets.length,
      totalRecords: records.length,
      recordsThisYear: thisYearRecords.length,
      upcomingReminders: upcomingReminders.length,
      totalSpent: records.reduce((sum, r) => sum + (r.cost || 0), 0),
      spentThisYear: thisYearRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
      recordsByMonth: this.getRecordsByMonth(thisYearRecords),
      mostCommonType: this.getMostCommonRecordType(records)
    };
  }

  private getRecordsByMonth(records: HealthRecord[]) {
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
    records.forEach(record => {
      const month = record.date.getMonth();
      months[month].count++;
    });
    return months;
  }

  private getMostCommonRecordType(records: HealthRecord[]) {
    const typeCounts = records.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(typeCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || null;
  }
}