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
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.findByUser(userId);
  }

  @Get('user/:userId/stats')
  getUserStats(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.betsService.getUserStats(userId);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.findByEvent(eventId);
  }

  @Post('event/:eventId/process')
  @HttpCode(HttpStatus.OK)
  processEventBets(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.betsService.processEventBets(eventId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.betsService.remove(id);
  }
}
