import { User } from '../../auth/entities/user.entity';
import { Event } from '../../events/entities/event.entity';
export declare enum BetStatus {
    PENDING = "pending",
    WON = "won",
    LOST = "lost"
}
export declare class Bet {
    id: string;
    selectedOption: string;
    odds: number;
    amount: number;
    status: BetStatus;
    profit: number;
    createdAt: Date;
    user: User;
    userId: string;
    event: Event;
    eventId: string;
}
