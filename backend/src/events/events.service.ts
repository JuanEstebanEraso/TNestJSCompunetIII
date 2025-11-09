import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { EventOption } from './entities/event-option.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { CloseEventDto } from './dto/close-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventOption)
    private readonly eventOptionRepository: Repository<EventOption>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      name: createEventDto.name,
      description: createEventDto.description,
      status: EventStatus.OPEN,
    });

    const savedEvent = await this.eventRepository.save(event);

    const options = createEventDto.options.map((optionDto) =>
      this.eventOptionRepository.create({
        name: optionDto.name,
        odds: optionDto.odds,
        eventId: savedEvent.id,
      }),
    );

    await this.eventOptionRepository.save(options);

    return this.findOne(savedEvent.id);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({
      relations: ['options'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllOpen(): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { status: EventStatus.OPEN },
      relations: ['options'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['options', 'bets', 'bets.user'],
    });

    if (!event) {
      throw new NotFoundException(`Evento con ID '${id}' no encontrado`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.CLOSED) {
      throw new BadRequestException('No se puede modificar un evento cerrado');
    }

    Object.assign(event, updateEventDto);
    await this.eventRepository.save(event);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }

  async closeEvent(id: string, closeEventDto: CloseEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (event.status === EventStatus.CLOSED) {
      throw new BadRequestException('El evento ya está cerrado');
    }

    const optionExists = event.options.some(
      (option) => option.name === closeEventDto.finalResult,
    );

    if (!optionExists) {
      throw new BadRequestException(
        `El resultado '${closeEventDto.finalResult}' no es una opción válida para este evento`,
      );
    }

    event.status = EventStatus.CLOSED;
    event.finalResult = closeEventDto.finalResult;

    return await this.eventRepository.save(event);
  }

  async getEventOption(optionId: string): Promise<EventOption> {
    const option = await this.eventOptionRepository.findOne({
      where: { id: optionId },
      relations: ['event'],
    });

    if (!option) {
      throw new NotFoundException(`Opción con ID '${optionId}' no encontrada`);
    }

    return option;
  }

  async validateOptionBelongsToEvent(
    eventId: string,
    optionId: string,
  ): Promise<boolean> {
    const option = await this.eventOptionRepository.findOne({
      where: { id: optionId, eventId },
    });

    return !!option;
  }
}
