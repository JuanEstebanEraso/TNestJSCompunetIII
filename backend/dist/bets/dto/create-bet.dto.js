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
exports.CreateBetDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBetDto {
    userId;
    eventId;
    selectedOption;
    amount;
}
exports.CreateBetDto = CreateBetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID del usuario que realiza la apuesta',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBetDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UUID del evento sobre el que se apuesta',
        example: '550e8400-e29b-41d4-a716-446655440001',
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateBetDto.prototype, "eventId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Opción seleccionada para la apuesta',
        example: 'Argentina gana',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBetDto.prototype, "selectedOption", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Monto a apostar',
        example: 100.00,
        minimum: 1,
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateBetDto.prototype, "amount", void 0);
//# sourceMappingURL=create-bet.dto.js.map