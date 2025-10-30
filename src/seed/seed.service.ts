import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { EventOption } from '../events/entities/event-option.entity';
import { Bet } from '../bets/entities/bet.entity';
import { EventStatus } from '../events/entities/event.entity';
import { BetStatus } from '../bets/entities/bet.entity';
import { seedData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventOption)
    private readonly eventOptionRepository: Repository<EventOption>,
    @InjectRepository(Bet)
    private readonly betRepository: Repository<Bet>,
  ) {}

  async seedAll() {
    try {
      console.log('🌱 Iniciando seed de datos...');

      await this.seedUsers();
      await this.seedEvents();
      await this.seedBets();

      console.log('✅ Seed completado exitosamente');
      return { message: 'Seed completado exitosamente' };
    } catch (error) {
      console.error('❌ Error durante el seed:', error);
      throw error;
    }
  }

  async seedUsers() {
    console.log('📝 Seeding usuarios...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    for (const userData of seedData.users) {
      const existingUser = await this.userRepository.findOne({
        where: { username: userData.username },
      });

      if (!existingUser) {
        const user = this.userRepository.create({
          username: userData.username,
          password: hashedPassword,
          roles: userData.roles,
          balance: userData.balance,
          isActive: userData.isActive,
        });
        await this.userRepository.save(user);
        console.log(`✅ Usuario creado: ${user.username} [${userData.roles.join(', ')}]`);
      } else {
        console.log(`⏭️  Usuario ya existe: ${userData.username}`);
      }
    }
  }

  async seedEvents() {
    console.log('🎲 Seeding eventos...');

    for (const eventData of seedData.events) {
      const existingEvent = await this.eventRepository.findOne({
        where: { name: eventData.name },
      });

      if (!existingEvent) {
        const event = this.eventRepository.create({
          name: eventData.name,
          description: eventData.description,
          status: eventData.status,
        });
        const savedEvent = await this.eventRepository.save(event);
        console.log(`✅ Evento creado: ${event.name}`);

        // Crear opciones del evento
        for (const optionData of eventData.options) {
          const option = this.eventOptionRepository.create({
            name: optionData.name,
            odds: optionData.odds,
            eventId: savedEvent.id,
          });
          await this.eventOptionRepository.save(option);
          console.log(`  ➜ Opción creada: ${option.name} (${option.odds})`);
        }
      } else {
        console.log(`⏭️  Evento ya existe: ${eventData.name}`);
      }
    }
  }

  async seedBets() {
    console.log('🎯 Seeding apuestas...');

    const users = await this.userRepository.find();
    const events = await this.eventRepository.find({ relations: ['options'] });

    if (users.length === 0 || events.length === 0) {
      console.log('⏭️  No hay usuarios o eventos para crear apuestas');
      return;
    }

    for (const betData of seedData.bets) {
      const user = users.find((u) => u.username === betData.username);
      const event = events.find((e) => e.name === betData.eventName);

      if (user && event) {
        const option = event.options.find((o) => o.name === betData.selectedOption);

        if (option) {
          const bet = this.betRepository.create({
            selectedOption: betData.selectedOption,
            odds: betData.odds,
            amount: betData.amount,
            status: betData.status,
            profit: betData.profit,
            userId: user.id,
            eventId: event.id,
          });
          await this.betRepository.save(bet);
          console.log(`✅ Apuesta creada: ${bet.selectedOption} - $${bet.amount}`);
        }
      }
    }
  }

  async clearAll() {
    try {
      console.log('🗑️  Limpiando datos...');
      
      // Deshabilitar temporalmente las foreign keys y limpiar todas las tablas
      await this.betRepository.query('TRUNCATE TABLE bets CASCADE');
      console.log('   ✅ Apuestas eliminadas');
      
      await this.eventOptionRepository.query('TRUNCATE TABLE event_options CASCADE');
      console.log('   ✅ Opciones de eventos eliminadas');
      
      await this.eventRepository.query('TRUNCATE TABLE events CASCADE');
      console.log('   ✅ Eventos eliminados');
      
      await this.userRepository.query('TRUNCATE TABLE users CASCADE');
      console.log('   ✅ Usuarios eliminados');
      
      console.log('✅ Todos los datos limpiados exitosamente');
      return { message: 'Todos los datos limpiados exitosamente' };
    } catch (error) {
      console.error('❌ Error al limpiar datos:', error);
      throw error;
    }
  }
}

