import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityTrackingService {
  constructor(@InjectModel(Activity.name) private activityModel: Model<Activity>) {}

  async create(createActivityDto: CreateActivityDto, userId: string): Promise<Activity> {
    const activityData = {
      ...createActivityDto,
      date: new Date(createActivityDto.date)
    };
    const activity = new this.activityModel(activityData);
    return activity.save();
  }

  async findByPet(petId: string, type?: string): Promise<Activity[]> {
    const filter: any = { petId, isActive: true };
    if (type) filter.type = type;
    return this.activityModel.find(filter).sort({ date: -1 }).exec();
  }

  async findById(id: string): Promise<Activity> {
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException(`Activity with ID '${id}' not found`);
    }
    return activity;
  }

  async delete(id: string): Promise<Activity> {
    const activity = await this.findById(id);
    return this.activityModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async getDailyStats(petId: string, date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const activities = await this.activityModel.find({
      petId,
      date: { $gte: startDate, $lte: endDate },
      isActive: true
    }).exec();

    return {
      totalWalks: activities.filter(a => a.type === 'walk').length,
      totalDistance: activities.filter(a => a.type === 'walk').reduce((sum, a) => sum + (a.distance || 0), 0),
      totalFeedings: activities.filter(a => a.type === 'feeding').length,
      totalFoodAmount: activities.filter(a => a.type === 'feeding').reduce((sum, a) => sum + (a.foodAmount || 0), 0),
      totalWaterIntake: activities.filter(a => a.type === 'water').reduce((sum, a) => sum + (a.waterAmount || 0), 0),
      activities
    };
  }
}