import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseEventDto {
  @ApiProperty({
    description: 'Resultado final del evento (debe coincidir con una de las opciones)',
    example: 'Argentina gana',
  })
  @IsString()
  @IsNotEmpty()
  finalResult: string;
}

