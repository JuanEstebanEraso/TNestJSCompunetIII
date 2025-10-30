import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  ValidateNested,
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateEventOptionDto } from './create-event-option.dto';

export class CreateEventDto {
  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Final Copa del Mundo 2024',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del evento',
    example: 'Partido final entre Argentina y Brasil',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Opciones de apuesta para el evento (mínimo 2)',
    type: [CreateEventOptionDto],
    example: [
      { name: 'Argentina gana', odds: 2.50 },
      { name: 'Brasil gana', odds: 3.00 },
      { name: 'Empate', odds: 3.50 }
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventOptionDto)
  @ArrayMinSize(2)
  options: CreateEventOptionDto[];
}

