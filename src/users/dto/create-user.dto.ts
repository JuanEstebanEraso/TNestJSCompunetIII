import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}

