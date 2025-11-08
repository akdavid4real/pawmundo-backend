import { Model } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private eventModel;
    constructor(eventModel: Model<EventDocument>);
    create(userId: string, createEventDto: CreateEventDto): Promise<Event>;
    findByUser(userId: string): Promise<Event[]>;
    findUpcoming(userId: string): Promise<Event[]>;
    findById(id: string, userId: string): Promise<Event>;
    update(id: string, userId: string, updateEventDto: UpdateEventDto): Promise<Event>;
    delete(id: string, userId: string): Promise<void>;
    findByCategory(userId: string, category: string): Promise<Event[]>;
}
