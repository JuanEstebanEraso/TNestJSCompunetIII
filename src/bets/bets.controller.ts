import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/enums/roles.enum';

@ApiTags('Bets')
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @Auth()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva apuesta' })
  @ApiResponse({ status: 201, description: 'Apuesta creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o saldo insuficiente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  @Auth(ValidRoles.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todas las apuestas (Solo Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de apuestas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener una apuesta por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la apuesta' })
  @ApiResponse({ status: 200, description: 'Apuesta encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Apuesta no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.findOne(id);
  }

  @Get('user/:userId')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todas las apuestas de un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de apuestas del usuario.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.findByUser(userId);
  }

  @Get('user/:userId/stats')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener estadísticas de apuestas de un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas del usuario.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  getUserStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.getUserStats(userId);
  }

  @Get('event/:eventId')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener todas las apuestas de un evento' })
  @ApiParam({ name: 'eventId', description: 'UUID del evento' })
  @ApiResponse({ status: 200, description: 'Lista de apuestas del evento.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.findByEvent(eventId);
  }

  @Post('event/:eventId/process')
  @Auth(ValidRoles.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Procesar apuestas de un evento (Solo Admin)' })
  @ApiParam({ name: 'eventId', description: 'UUID del evento' })
  @ApiResponse({ status: 200, description: 'Apuestas procesadas exitosamente.' })
  @ApiResponse({ status: 400, description: 'Evento no válido para procesar apuestas.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido.' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  processEventBets(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.processEventBets(eventId);
  }

  @Delete(':id')
  @Auth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una apuesta' })
  @ApiParam({ name: 'id', description: 'UUID de la apuesta' })
  @ApiResponse({ status: 204, description: 'Apuesta eliminada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Apuesta no encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.remove(id);
  }
}
