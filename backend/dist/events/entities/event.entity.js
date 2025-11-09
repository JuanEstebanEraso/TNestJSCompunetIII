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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.EventStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const event_option_entity_1 = require("./event-option.entity");
const bet_entity_1 = require("../../bets/entities/bet.entity");
var EventStatus;
(function (EventStatus) {
    EventStatus["OPEN"] = "open";
    EventStatus["CLOSED"] = "closed";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
let Event = class Event {
    id;
    name;
    description;
    status;
    finalResult;
    createdAt;
    updatedAt;
    options;
    bets;
};
exports.Event = Event;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del evento',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del evento',
        example: 'Final Copa del Mundo 2024',
        maxLength: 200,
    }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
    }),
    __metadata("design:type", String)
], Event.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del evento',
        example: 'Partido final entre Argentina y Brasil',
        required: false,
    }),
    (0, typeorm_1.Column)({
        type: 'text',
        nullable: true,
    }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado actual del evento',
        enum: EventStatus,
        example: EventStatus.OPEN,
        default: EventStatus.OPEN,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.OPEN,
    }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Resultado final del evento',
        example: 'Argentina',
        required: false,
    }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        nullable: true,
    }),
    __metadata("design:type", String)
], Event.prototype, "finalResult", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del evento',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización del evento',
        example: '2024-01-20T15:45:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Opciones de apuesta disponibles para el evento',
        type: () => [event_option_entity_1.EventOption],
    }),
    (0, typeorm_1.OneToMany)(() => event_option_entity_1.EventOption, (option) => option.event, { cascade: true }),
    __metadata("design:type", Array)
], Event.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apuestas realizadas en este evento',
        type: () => [bet_entity_1.Bet],
    }),
    (0, typeorm_1.OneToMany)(() => bet_entity_1.Bet, (bet) => bet.event),
    __metadata("design:type", Array)
], Event.prototype, "bets", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map