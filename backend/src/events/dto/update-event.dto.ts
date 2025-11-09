import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';
import { EventStatus } from '../entities/event.entity';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @ApiPropertyOptional({
    description: 'Estado del evento',
    enum: EventStatus,
    example: EventStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}

