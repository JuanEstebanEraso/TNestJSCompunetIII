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
exports.BetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bets_service_1 = require("./bets.service");
const create_bet_dto_1 = require("./dto/create-bet.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_enum_1 = require("../auth/enums/roles.enum");
let BetsController = class BetsController {
    betsService;
    constructor(betsService) {
        this.betsService = betsService;
    }
    create(createBetDto) {
        return this.betsService.create(createBetDto);
    }
    findAll() {
        return this.betsService.findAll();
    }
    findOne(id) {
        return this.betsService.findOne(id);
    }
    findByUser(userId) {
        return this.betsService.findByUser(userId);
    }
    getUserStats(userId) {
        return this.betsService.getUserStats(userId);
    }
    findByEvent(eventId) {
        return this.betsService.findByEvent(eventId);
    }
    processEventBets(eventId) {
        return this.betsService.processEventBets(eventId);
    }
    remove(id) {
        return this.betsService.remove(id);
    }
};
exports.BetsController = BetsController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva apuesta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Apuesta creada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o saldo insuficiente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento no encontrado.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bet_dto_1.CreateBetDto]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorator_1.Auth)(roles_enum_1.ValidRoles.ADMIN),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las apuestas (Solo Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de apuestas.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso prohibido.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una apuesta por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la apuesta' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Apuesta encontrada.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Apuesta no encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las apuestas de un usuario' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'UUID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de apuestas del usuario.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('user/:userId/stats'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de apuestas de un usuario' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'UUID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas del usuario.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('event/:eventId'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las apuestas de un evento' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'UUID del evento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de apuestas del evento.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "findByEvent", null);
__decorate([
    (0, common_1.Post)('event/:eventId/process'),
    (0, auth_decorator_1.Auth)(roles_enum_1.ValidRoles.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Procesar apuestas de un evento (Solo Admin)' }),
    (0, swagger_1.ApiParam)({ name: 'eventId', description: 'UUID del evento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Apuestas procesadas exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Evento no válido para procesar apuestas.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso prohibido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Evento no encontrado.' }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "processEventBets", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una apuesta' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la apuesta' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Apuesta eliminada.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Apuesta no encontrada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BetsController.prototype, "remove", null);
exports.BetsController = BetsController = __decorate([
    (0, swagger_1.ApiTags)('Bets'),
    (0, common_1.Controller)('bets'),
    __metadata("design:paramtypes", [bets_service_1.BetsService])
], BetsController);
//# sourceMappingURL=bets.controller.js.map