import { IsUUID, IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBetDto {
  @ApiProperty({
    description: 'UUID del usuario que realiza la apuesta',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'UUID del evento sobre el que se apuesta',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  eventId: string;

  @ApiProperty({
    description: 'Opción seleccionada para la apuesta',
    example: 'Argentina gana',
  })
  @IsString()
  @IsNotEmpty()
  selectedOption: string;

  @ApiProperty({
    description: 'Monto a apostar',
    example: 100.00,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;
}

