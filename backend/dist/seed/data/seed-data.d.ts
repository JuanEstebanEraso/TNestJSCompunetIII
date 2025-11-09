import { EventStatus } from '../../events/entities/event.entity';
import { BetStatus } from '../../bets/entities/bet.entity';
export declare const seedData: {
    users: {
        username: string;
        roles: string[];
        balance: number;
        isActive: boolean;
    }[];
    events: ({
        name: string;
        description: string;
        status: EventStatus;
        options: {
            name: string;
            odds: number;
        }[];
        finalResult?: undefined;
    } | {
        name: string;
        description: string;
        status: EventStatus;
        finalResult: string;
        options: {
            name: string;
            odds: number;
        }[];
    })[];
    bets: {
        username: string;
        eventName: string;
        selectedOption: string;
        odds: number;
        amount: number;
        status: BetStatus;
        profit: number;
    }[];
};
