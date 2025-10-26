import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateEventOptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1.01)
  odds: number;
}

