import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(req: any, createEventDto: CreateEventDto): Promise<import("./schemas/event.schema").Event>;
    findMyEvents(req: any): Promise<import("./schemas/event.schema").Event[]>;
    findUpcoming(req: any): Promise<import("./schemas/event.schema").Event[]>;
    findByCategory(req: any, category: string): Promise<import("./schemas/event.schema").Event[]>;
    findOne(id: string, req: any): Promise<import("./schemas/event.schema").Event>;
    update(id: string, updateEventDto: UpdateEventDto, req: any): Promise<import("./schemas/event.schema").Event>;
    remove(id: string, req: any): Promise<void>;
}
