import { 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsOptional, 
  IsNumber, 
  Min,
  IsArray 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'john_doe',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'mySecurePassword123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Roles del usuario en el sistema',
    example: ['user'],
    default: ['user'],
    isArray: true,
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional({
    description: 'Balance inicial del usuario',
    example: 10000.00,
    minimum: 0,
    default: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}

