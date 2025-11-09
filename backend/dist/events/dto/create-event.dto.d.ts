import { CreateEventOptionDto } from './create-event-option.dto';
export declare class CreateEventDto {
    name: string;
    description?: string;
    options: CreateEventOptionDto[];
}
