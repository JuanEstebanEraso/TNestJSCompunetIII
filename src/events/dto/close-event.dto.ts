import { IsString, IsNotEmpty } from 'class-validator';

export class CloseEventDto {
  @IsString()
  @IsNotEmpty()
  finalResult: string;
}

