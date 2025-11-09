import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { EventOption } from '../events/entities/event-option.entity';
import { Bet } from '../bets/entities/bet.entity';
export declare class SeedService {
    private readonly userRepository;
    private readonly eventRepository;
    private readonly eventOptionRepository;
    private readonly betRepository;
    constructor(userRepository: Repository<User>, eventRepository: Repository<Event>, eventOptionRepository: Repository<EventOption>, betRepository: Repository<Bet>);
    seedAll(): Promise<{
        message: string;
    }>;
    seedUsers(): Promise<void>;
    seedEvents(): Promise<void>;
    seedBets(): Promise<void>;
    clearAll(): Promise<{
        message: string;
    }>;
}
