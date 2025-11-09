import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
export declare class BetsController {
    private readonly betsService;
    constructor(betsService: BetsService);
    create(createBetDto: CreateBetDto): Promise<import("./entities/bet.entity").Bet>;
    findAll(): Promise<import("./entities/bet.entity").Bet[]>;
    findOne(id: string): Promise<import("./entities/bet.entity").Bet>;
    findByUser(userId: string): Promise<import("./entities/bet.entity").Bet[]>;
    getUserStats(userId: string): Promise<any>;
    findByEvent(eventId: string): Promise<import("./entities/bet.entity").Bet[]>;
    processEventBets(eventId: string): Promise<void>;
    remove(id: string): Promise<void>;
}
