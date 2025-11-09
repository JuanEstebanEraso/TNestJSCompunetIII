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
exports.Bet = exports.BetStatus = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../auth/entities/user.entity");
const event_entity_1 = require("../../events/entities/event.entity");
var BetStatus;
(function (BetStatus) {
    BetStatus["PENDING"] = "pending";
    BetStatus["WON"] = "won";
    BetStatus["LOST"] = "lost";
})(BetStatus || (exports.BetStatus = BetStatus = {}));
let Bet = class Bet {
    id;
    selectedOption;
    odds;
    amount;
    status;
    profit;
    createdAt;
    user;
    userId;
    event;
    eventId;
};
exports.Bet = Bet;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la apuesta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bet.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Opción seleccionada para la apuesta',
        example: 'Argentina gana',
        maxLength: 200,
    }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
    }),
    __metadata("design:type", String)
], Bet.prototype, "selectedOption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cuota aplicada al momento de realizar la apuesta',
        example: 2.50,
    }),
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Bet.prototype, "odds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto apostado',
        example: 100.00,
        minimum: 0.01,
    }),
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Bet.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la apuesta',
        enum: BetStatus,
        example: BetStatus.PENDING,
        default: BetStatus.PENDING,
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: BetStatus,
        default: BetStatus.PENDING,
    }),
    __metadata("design:type", String)
], Bet.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ganancia obtenida (negativo si perdió)',
        example: 150.00,
        default: 0,
    }),
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Bet.prototype, "profit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación de la apuesta',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Bet.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que realizó la apuesta',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.bets),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Bet.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que realizó la apuesta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bet.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Evento sobre el que se realizó la apuesta',
        type: () => event_entity_1.Event,
    }),
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.bets),
    (0, typeorm_1.JoinColumn)({ name: 'eventId' }),
    __metadata("design:type", event_entity_1.Event)
], Bet.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del evento sobre el que se apostó',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Bet.prototype, "eventId", void 0);
exports.Bet = Bet = __decorate([
    (0, typeorm_1.Entity)('bets')
], Bet);
//# sourceMappingURL=bet.entity.js.map