import { IsUUID, IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

export class CreateBetDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  selectedOption: string;

  @IsNumber()
  @Min(1)
  amount: number;
}

