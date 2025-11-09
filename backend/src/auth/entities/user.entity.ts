import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Bet } from '../../bets/entities/bet.entity';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'john_doe',
    maxLength: 100,
  })
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  username: string;

  @ApiProperty({
    description: 'Balance de la cuenta del usuario',
    example: 10000.50,
    default: 10000,
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 10000,
  })
  balance: number;

  @ApiProperty({
    description: 'Contraseña hasheada del usuario',
    example: '$2b$10$...',
  })
  @Column({
    type: 'varchar',
    length: 255,
    select: false,
  })
  password?: string;

  @ApiProperty({
    description: 'Roles del usuario en el sistema',
    example: ['user'],
    enum: ['user', 'admin'],
    default: ['user'],
  })
  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    description: 'Estado de activación del usuario',
    example: true,
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-20T15:45:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Lista de apuestas realizadas por el usuario',
    type: () => [Bet],
  })
  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];

  @BeforeInsert()
  @BeforeUpdate()
  normalizeUsername() {
    this.username = this.username.toLowerCase().trim();
  }
}

