import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
}

@Entity('bets')
export class Bet {
  @ApiProperty({
    description: 'ID único de la apuesta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Opción seleccionada para la apuesta',
    example: 'Argentina gana',
    maxLength: 200,
  })
  @Column({
    type: 'varchar',
    length: 200,
  })
  selectedOption: string;

  @ApiProperty({
    description: 'Cuota aplicada al momento de realizar la apuesta',
    example: 2.50,
  })
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  odds: number;

  @ApiProperty({
    description: 'Monto apostado',
    example: 100.00,
    minimum: 0.01,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @ApiProperty({
    description: 'Estado de la apuesta',
    enum: BetStatus,
    example: BetStatus.PENDING,
    default: BetStatus.PENDING,
  })
  @Column({
    type: 'enum',
    enum: BetStatus,
    default: BetStatus.PENDING,
  })
  status: BetStatus;

  @ApiProperty({
    description: 'Ganancia obtenida (negativo si perdió)',
    example: 150.00,
    default: 0,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  profit: number;

  @ApiProperty({
    description: 'Fecha de creación de la apuesta',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Usuario que realizó la apuesta',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.bets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'ID del usuario que realizó la apuesta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column()
  userId: string;

  @ApiProperty({
    description: 'Evento sobre el que se realizó la apuesta',
    type: () => Event,
  })
  @ManyToOne(() => Event, (event) => event.bets)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ApiProperty({
    description: 'ID del evento sobre el que se apostó',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column()
  eventId: string;
}

