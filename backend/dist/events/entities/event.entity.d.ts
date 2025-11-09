import { EventOption } from './event-option.entity';
import { Bet } from '../../bets/entities/bet.entity';
export declare enum EventStatus {
    OPEN = "open",
    CLOSED = "closed"
}
export declare class Event {
    id: string;
    name: string;
    description: string;
    status: EventStatus;
    finalResult: string;
    createdAt: Date;
    updatedAt: Date;
    options: EventOption[];
    bets: Bet[];
}
