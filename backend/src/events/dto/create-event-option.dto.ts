import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventOptionDto {
  @ApiProperty({
    description: 'Nombre de la opción de apuesta',
    example: 'Argentina gana',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Cuota/probabilidad de la opción',
    example: 2.50,
    minimum: 1.01,
  })
  @IsNumber()
  @Min(1.01)
  odds: number;
}

