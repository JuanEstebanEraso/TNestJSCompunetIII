import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { EventOption } from './entities/event-option.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CloseEventDto } from './dto/close-event.dto';
export declare class EventsService {
    private readonly eventRepository;
    private readonly eventOptionRepository;
    constructor(eventRepository: Repository<Event>, eventOptionRepository: Repository<EventOption>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findAllOpen(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<void>;
    closeEvent(id: string, closeEventDto: CloseEventDto): Promise<Event>;
    getEventOption(optionId: string): Promise<EventOption>;
    validateOptionBelongsToEvent(eventId: string, optionId: string): Promise<boolean>;
}
