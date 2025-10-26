import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventOption } from './event-option.entity';
import { Bet } from '../../bets/entities/bet.entity';

export enum EventStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 200,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.OPEN,
  })
  status: EventStatus;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  finalResult: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventOption, (option) => option.event, { cascade: true })
  options: EventOption[];

  @OneToMany(() => Bet, (bet) => bet.event)
  bets: Bet[];
}

