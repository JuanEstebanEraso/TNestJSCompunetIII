"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bet_entity_1 = require("./entities/bet.entity");
const users_service_1 = require("../users/users.service");
const events_service_1 = require("../events/events.service");
const event_entity_1 = require("../events/entities/event.entity");
let BetsService = class BetsService {
    betRepository;
    usersService;
    eventsService;
    constructor(betRepository, usersService, eventsService) {
        this.betRepository = betRepository;
        this.usersService = usersService;
        this.eventsService = eventsService;
    }
    async create(createBetDto) {
        const user = await this.usersService.findOne(createBetDto.userId);
        if (Number(user.balance) < createBetDto.amount) {
            throw new common_1.BadRequestException(`Saldo insuficiente. Saldo actual: ${user.balance}, Monto requerido: ${createBetDto.amount}`);
        }
        const event = await this.eventsService.findOne(createBetDto.eventId);
        if (event.status !== event_entity_1.EventStatus.OPEN) {
            throw new common_1.BadRequestException('El evento no está disponible para apuestas');
        }
        const selectedOption = event.options.find((option) => option.name === createBetDto.selectedOption);
        if (!selectedOption) {
            throw new common_1.BadRequestException(`La opción '${createBetDto.selectedOption}' no existe en este evento`);
        }
        await this.usersService.updateBalance(createBetDto.userId, -createBetDto.amount);
        const bet = this.betRepository.create({
            userId: createBetDto.userId,
            eventId: createBetDto.eventId,
            selectedOption: createBetDto.selectedOption,
            odds: selectedOption.odds,
            amount: createBetDto.amount,
            status: bet_entity_1.BetStatus.PENDING,
            profit: 0,
        });
        return await this.betRepository.save(bet);
    }
    async findAll() {
        return await this.betRepository.find({
            relations: ['user', 'event'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const bet = await this.betRepository.findOne({
            where: { id },
            relations: ['user', 'event', 'event.options'],
        });
        if (!bet) {
            throw new common_1.NotFoundException(`Apuesta con ID '${id}' no encontrada`);
        }
        return bet;
    }
    async findByUser(userId) {
        await this.usersService.findOne(userId);
        return await this.betRepository.find({
            where: { userId },
            relations: ['event'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByEvent(eventId) {
        await this.eventsService.findOne(eventId);
        return await this.betRepository.find({
            where: { eventId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async processEventBets(eventId) {
        const event = await this.eventsService.findOne(eventId);
        if (event.status !== event_entity_1.EventStatus.CLOSED) {
            throw new common_1.BadRequestException('El evento debe estar cerrado para procesar apuestas');
        }
        if (!event.finalResult) {
            throw new common_1.BadRequestException('El evento no tiene un resultado final definido');
        }
        const bets = await this.betRepository.find({
            where: { eventId, status: bet_entity_1.BetStatus.PENDING },
            relations: ['user'],
        });
        for (const bet of bets) {
            if (bet.selectedOption === event.finalResult) {
                const profit = Number(bet.amount) * Number(bet.odds);
                bet.status = bet_entity_1.BetStatus.WON;
                bet.profit = profit;
                await this.usersService.updateBalance(bet.userId, profit);
            }
            else {
                bet.status = bet_entity_1.BetStatus.LOST;
                bet.profit = 0;
            }
            await this.betRepository.save(bet);
        }
    }
    async remove(id) {
        const bet = await this.findOne(id);
        if (bet.status !== bet_entity_1.BetStatus.PENDING) {
            throw new common_1.BadRequestException('Solo se pueden eliminar apuestas pendientes');
        }
        await this.usersService.updateBalance(bet.userId, Number(bet.amount));
        await this.betRepository.remove(bet);
    }
    async getUserStats(userId) {
        const bets = await this.findByUser(userId);
        const stats = {
            totalBets: bets.length,
            pendingBets: bets.filter((b) => b.status === bet_entity_1.BetStatus.PENDING).length,
            wonBets: bets.filter((b) => b.status === bet_entity_1.BetStatus.WON).length,
            lostBets: bets.filter((b) => b.status === bet_entity_1.BetStatus.LOST).length,
            totalAmountBet: bets.reduce((sum, b) => sum + Number(b.amount), 0),
            totalProfit: bets
                .filter((b) => b.status === bet_entity_1.BetStatus.WON)
                .reduce((sum, b) => sum + Number(b.profit), 0),
            totalLoss: bets
                .filter((b) => b.status === bet_entity_1.BetStatus.LOST)
                .reduce((sum, b) => sum + Number(b.amount), 0),
        };
        return stats;
    }
};
exports.BetsService = BetsService;
exports.BetsService = BetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bet_entity_1.Bet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        events_service_1.EventsService])
], BetsService);
//# sourceMappingURL=bets.service.js.map