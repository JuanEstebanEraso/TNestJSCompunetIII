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
exports.EventOption = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const event_entity_1 = require("./event.entity");
let EventOption = class EventOption {
    id;
    name;
    odds;
    event;
    eventId;
};
exports.EventOption = EventOption;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la opción',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventOption.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la opción de apuesta',
        example: 'Argentina gana',
        maxLength: 200,
    }),
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 200,
    }),
    __metadata("design:type", String)
], EventOption.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cuota/probabilidad de la opción',
        example: 2.50,
        minimum: 1.01,
    }),
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 5,
        scale: 2,
    }),
    __metadata("design:type", Number)
], EventOption.prototype, "odds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Evento al que pertenece la opción',
        type: () => event_entity_1.Event,
    }),
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.options, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'eventId' }),
    __metadata("design:type", event_entity_1.Event)
], EventOption.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del evento asociado',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EventOption.prototype, "eventId", void 0);
exports.EventOption = EventOption = __decorate([
    (0, typeorm_1.Entity)('event_options')
], EventOption);
//# sourceMappingURL=event-option.entity.js.map