import { Repository } from 'typeorm';
import { Bet } from './entities/bet.entity';
import { CreateBetDto } from './dto/create-bet.dto';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
export declare class BetsService {
    private readonly betRepository;
    private readonly usersService;
    private readonly eventsService;
    constructor(betRepository: Repository<Bet>, usersService: UsersService, eventsService: EventsService);
    create(createBetDto: CreateBetDto): Promise<Bet>;
    findAll(): Promise<Bet[]>;
    findOne(id: string): Promise<Bet>;
    findByUser(userId: string): Promise<Bet[]>;
    findByEvent(eventId: string): Promise<Bet[]>;
    processEventBets(eventId: string): Promise<void>;
    remove(id: string): Promise<void>;
    getUserStats(userId: string): Promise<any>;
}
