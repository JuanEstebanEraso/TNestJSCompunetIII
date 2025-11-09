"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../auth/entities/user.entity");
const event_entity_1 = require("../events/entities/event.entity");
const event_option_entity_1 = require("../events/entities/event-option.entity");
const bet_entity_1 = require("../bets/entities/bet.entity");
const seed_data_1 = require("./data/seed-data");
let SeedService = class SeedService {
    userRepository;
    eventRepository;
    eventOptionRepository;
    betRepository;
    constructor(userRepository, eventRepository, eventOptionRepository, betRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.eventOptionRepository = eventOptionRepository;
        this.betRepository = betRepository;
    }
    async seedAll() {
        try {
            await this.seedUsers();
            await this.seedEvents();
            await this.seedBets();
            return { message: 'Seed completado exitosamente' };
        }
        catch (error) {
            throw error;
        }
    }
    async seedUsers() {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('password123', saltRounds);
        for (const userData of seed_data_1.seedData.users) {
            const existingUser = await this.userRepository.findOne({
                where: { username: userData.username },
            });
            if (!existingUser) {
                const user = this.userRepository.create({
                    username: userData.username,
                    password: hashedPassword,
                    roles: userData.roles,
                    balance: userData.balance,
                    isActive: userData.isActive,
                });
                await this.userRepository.save(user);
            }
        }
    }
    async seedEvents() {
        for (const eventData of seed_data_1.seedData.events) {
            const existingEvent = await this.eventRepository.findOne({
                where: { name: eventData.name },
            });
            if (!existingEvent) {
                const event = this.eventRepository.create({
                    name: eventData.name,
                    description: eventData.description,
                    status: eventData.status,
                });
                const savedEvent = await this.eventRepository.save(event);
                for (const optionData of eventData.options) {
                    const option = this.eventOptionRepository.create({
                        name: optionData.name,
                        odds: optionData.odds,
                        eventId: savedEvent.id,
                    });
                    await this.eventOptionRepository.save(option);
                }
            }
        }
    }
    async seedBets() {
        const users = await this.userRepository.find();
        const events = await this.eventRepository.find({ relations: ['options'] });
        if (users.length === 0 || events.length === 0) {
            return;
        }
        for (const betData of seed_data_1.seedData.bets) {
            const user = users.find((u) => u.username === betData.username);
            const event = events.find((e) => e.name === betData.eventName);
            if (user && event) {
                const option = event.options.find((o) => o.name === betData.selectedOption);
                if (option) {
                    const bet = this.betRepository.create({
                        selectedOption: betData.selectedOption,
                        odds: betData.odds,
                        amount: betData.amount,
                        status: betData.status,
                        profit: betData.profit,
                        userId: user.id,
                        eventId: event.id,
                    });
                    await this.betRepository.save(bet);
                }
            }
        }
    }
    async clearAll() {
        try {
            await this.betRepository.query('TRUNCATE TABLE bets CASCADE');
            await this.eventOptionRepository.query('TRUNCATE TABLE event_options CASCADE');
            await this.eventRepository.query('TRUNCATE TABLE events CASCADE');
            await this.userRepository.query('TRUNCATE TABLE users CASCADE');
            return { message: 'Todos los datos limpiados exitosamente' };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(2, (0, typeorm_1.InjectRepository)(event_option_entity_1.EventOption)),
    __param(3, (0, typeorm_1.InjectRepository)(bet_entity_1.Bet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map