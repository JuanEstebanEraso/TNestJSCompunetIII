import { CreateEventDto } from './create-event.dto';
import { EventStatus } from '../entities/event.entity';
declare const UpdateEventDto_base: import("@nestjs/common").Type<Partial<CreateEventDto>>;
export declare class UpdateEventDto extends UpdateEventDto_base {
    status?: EventStatus;
}
export {};
