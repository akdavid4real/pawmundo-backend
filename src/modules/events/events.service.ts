import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(userId: string, createEventDto: CreateEventDto): Promise<Event> {
    console.log('📝 Creating event with data:', { userId, createEventDto });
    const event = new this.eventModel({
      ...createEventDto,
      userId: new Types.ObjectId(userId),
      petId: createEventDto.petId ? new Types.ObjectId(createEventDto.petId) : undefined,
    });
    const saved = await event.save();
    console.log('✅ Event saved:', saved);
    return saved;
  }

  async findByUser(userId: string): Promise<Event[]> {
    console.log('🔍 Finding events for user:', userId);
    const query = { userId: new Types.ObjectId(userId), isActive: true };
    console.log('🔍 Query:', query);
    
    const allEvents = await this.eventModel.find({}).exec();
    console.log('📊 Total events in DB:', allEvents.length);
    console.log('📊 All events:', allEvents);
    
    const events = await this.eventModel
      .find(query)
      .populate('petId', 'name breed')
      .sort({ eventDate: 1 })
      .exec();
    console.log('📋 Found events for user:', events.length);
    console.log('📋 Events:', events);
    return events;
  }

  async findUpcoming(userId: string): Promise<Event[]> {
    const today = new Date();
    return this.eventModel
      .find({
        userId: new Types.ObjectId(userId),
        eventDate: { $gte: today },
        status: 'scheduled',
        isActive: true,
      })
      .populate('petId', 'name breed')
      .sort({ eventDate: 1 })
      .limit(10)
      .exec();
  }

  async findById(id: string, userId: string): Promise<Event> {
    const event = await this.eventModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), isActive: true })
      .populate('petId', 'name breed')
      .exec();
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async update(id: string, userId: string, updateEventDto: UpdateEventDto): Promise<Event> {
    try {
      console.log('🔄 Updating event:', { id, userId, updateEventDto });
      
      const updateData: any = { ...updateEventDto };
      if (updateEventDto.petId) {
        updateData.petId = new Types.ObjectId(updateEventDto.petId);
      }
      
      const event = await this.eventModel
        .findOneAndUpdate(
          { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId), isActive: true },
          updateData,
          { new: true }
        )
        .populate('petId', 'name breed')
        .exec();
      
      if (!event) {
        throw new NotFoundException('Event not found');
      }
      console.log('✅ Event updated:', event);
      return event;
    } catch (error) {
      console.error('❌ Update error:', error);
      throw error;
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.eventModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { isActive: false },
        { new: true }
      )
      .exec();
    
    if (!result) {
      throw new NotFoundException('Event not found');
    }
  }

  async findByCategory(userId: string, category: string): Promise<Event[]> {
    return this.eventModel
      .find({ userId: new Types.ObjectId(userId), category, isActive: true })
      .populate('petId', 'name breed')
      .sort({ eventDate: 1 })
      .exec();
  }
}