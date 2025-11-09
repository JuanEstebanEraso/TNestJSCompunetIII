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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_entity_1 = require("./entities/event.entity");
const event_option_entity_1 = require("./entities/event-option.entity");
let EventsService = class EventsService {
    eventRepository;
    eventOptionRepository;
    constructor(eventRepository, eventOptionRepository) {
        this.eventRepository = eventRepository;
        this.eventOptionRepository = eventOptionRepository;
    }
    async create(createEventDto) {
        const event = this.eventRepository.create({
            name: createEventDto.name,
            description: createEventDto.description,
            status: event_entity_1.EventStatus.OPEN,
        });
        const savedEvent = await this.eventRepository.save(event);
        const options = createEventDto.options.map((optionDto) => this.eventOptionRepository.create({
            name: optionDto.name,
            odds: optionDto.odds,
            eventId: savedEvent.id,
        }));
        await this.eventOptionRepository.save(options);
        return this.findOne(savedEvent.id);
    }
    async findAll() {
        return await this.eventRepository.find({
            relations: ['options'],
            order: { createdAt: 'DESC' },
        });
    }
    async findAllOpen() {
        return await this.eventRepository.find({
            where: { status: event_entity_1.EventStatus.OPEN },
            relations: ['options'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: ['options', 'bets', 'bets.user'],
        });
        if (!event) {
            throw new common_1.NotFoundException(`Evento con ID '${id}' no encontrado`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        const event = await this.findOne(id);
        if (event.status === event_entity_1.EventStatus.CLOSED) {
            throw new common_1.BadRequestException('No se puede modificar un evento cerrado');
        }
        Object.assign(event, updateEventDto);
        await this.eventRepository.save(event);
        return this.findOne(id);
    }
    async remove(id) {
        const event = await this.findOne(id);
        await this.eventRepository.remove(event);
    }
    async closeEvent(id, closeEventDto) {
        const event = await this.findOne(id);
        if (event.status === event_entity_1.EventStatus.CLOSED) {
            throw new common_1.BadRequestException('El evento ya está cerrado');
        }
        const optionExists = event.options.some((option) => option.name === closeEventDto.finalResult);
        if (!optionExists) {
            throw new common_1.BadRequestException(`El resultado '${closeEventDto.finalResult}' no es una opción válida para este evento`);
        }
        event.status = event_entity_1.EventStatus.CLOSED;
        event.finalResult = closeEventDto.finalResult;
        return await this.eventRepository.save(event);
    }
    async getEventOption(optionId) {
        const option = await this.eventOptionRepository.findOne({
            where: { id: optionId },
            relations: ['event'],
        });
        if (!option) {
            throw new common_1.NotFoundException(`Opción con ID '${optionId}' no encontrada`);
        }
        return option;
    }
    async validateOptionBelongsToEvent(eventId, optionId) {
        const option = await this.eventOptionRepository.findOne({
            where: { id: optionId, eventId },
        });
        return !!option;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(event_entity_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(event_option_entity_1.EventOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map