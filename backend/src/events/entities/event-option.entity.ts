import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Event } from './event.entity';

@Entity('event_options')
export class EventOption {
  @ApiProperty({
    description: 'ID único de la opción',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de la opción de apuesta',
    example: 'Argentina gana',
    maxLength: 200,
  })
  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @ApiProperty({
    description: 'Cuota/probabilidad de la opción',
    example: 2.50,
    minimum: 1.01,
  })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  odds: number;

  @ApiProperty({
    description: 'Evento al que pertenece la opción',
    type: () => Event,
  })
  @ManyToOne(() => Event, (event) => event.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ApiProperty({
    description: 'ID del evento asociado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column()
  eventId: string;
}

