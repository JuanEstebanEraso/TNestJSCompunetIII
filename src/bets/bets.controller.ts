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
  UseGuards,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.findByUser(userId);
  }

  @Get('user/:userId/stats')
  @UseGuards(JwtAuthGuard)
  getUserStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.getUserStats(userId);
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard)
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.findByEvent(eventId);
  }

  @Post('event/:eventId/process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  processEventBets(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.processEventBets(eventId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.remove(id);
  }
}
