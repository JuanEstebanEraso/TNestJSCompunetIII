import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EventOption } from './event-option.entity';
import { Bet } from '../../bets/entities/bet.entity';

export enum EventStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('events')
export class Event {
  @ApiProperty({
    description: 'ID único del evento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Final Copa del Mundo 2024',
    maxLength: 200,
  })
  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del evento',
    example: 'Partido final entre Argentina y Brasil',
    required: false,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    description: 'Estado actual del evento',
    enum: EventStatus,
    example: EventStatus.OPEN,
    default: EventStatus.OPEN,
  })
  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.OPEN,
  })
  status: EventStatus;

  @ApiProperty({
    description: 'Resultado final del evento',
    example: 'Argentina',
    required: false,
  })
  @Column({
    type: 'varchar',
    nullable: true,
  })
  finalResult: string;

  @ApiProperty({
    description: 'Fecha de creación del evento',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del evento',
    example: '2024-01-20T15:45:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Opciones de apuesta disponibles para el evento',
    type: () => [EventOption],
  })
  @OneToMany(() => EventOption, (option) => option.event, { cascade: true })
  options: EventOption[];

  @ApiProperty({
    description: 'Apuestas realizadas en este evento',
    type: () => [Bet],
  })
  @OneToMany(() => Bet, (bet) => bet.event)
  bets: Bet[];
}

