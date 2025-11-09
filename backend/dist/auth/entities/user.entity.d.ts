import { Bet } from '../../bets/entities/bet.entity';
export declare class User {
    id: string;
    username: string;
    balance: number;
    password?: string;
    roles: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    bets: Bet[];
    normalizeUsername(): void;
}
