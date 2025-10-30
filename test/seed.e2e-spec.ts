import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Seed (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    dataSource = moduleFixture.get<DataSource>(DataSource);
    
    await app.init();
  });

  afterAll(async () => {
    await dataSource.query('TRUNCATE TABLE bets CASCADE');
    await dataSource.query('TRUNCATE TABLE event_options CASCADE');
    await dataSource.query('TRUNCATE TABLE events CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    
    await app.close();
  });

  describe('/seed (DELETE)', () => {
    it('should clear all data from database', () => {
      return request(app.getHttpServer())
        .delete('/api/seed')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('limpiados');
        });
    });

    it('should handle multiple clear requests', async () => {
      await request(app.getHttpServer())
        .delete('/api/seed')
        .expect(200);

      return request(app.getHttpServer())
        .delete('/api/seed')
        .expect(200);
    });
  });

  describe('/seed (POST)', () => {
    beforeEach(async () => {
      // Limpiar antes de cada test
      await request(app.getHttpServer())
        .delete('/api/seed');
    });

    it('should seed database successfully', () => {
      return request(app.getHttpServer())
        .post('/api/seed')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('Seed completado');
        });
    });

    it('should create users when seeding', async () => {
      await request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);

      const users = await dataSource.query('SELECT * FROM users');
      expect(users.length).toBeGreaterThan(0);
    });

    it('should create events when seeding', async () => {
      await request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);

      const events = await dataSource.query('SELECT * FROM events');
      expect(events.length).toBeGreaterThan(0);
    });

    it('should create event options when seeding', async () => {
      await request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);

      const options = await dataSource.query('SELECT * FROM event_options');
      expect(options.length).toBeGreaterThan(0);
    });

    it('should create bets when seeding', async () => {
      await request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);

      const bets = await dataSource.query('SELECT * FROM bets');
      expect(bets.length).toBeGreaterThan(0);
    });

    it('should handle seeding with existing data', async () => {
      // Primera seed
      await request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);

      // Segunda seed (debería manejar duplicados)
      return request(app.getHttpServer())
        .post('/api/seed')
        .expect(200);
    });
  });

  describe('Seed Data Integrity', () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .delete('/api/seed');
      
      await request(app.getHttpServer())
        .post('/api/seed');
    });

    it('should create admin user with correct roles', async () => {
      const adminUsers = await dataSource.query(
        "SELECT * FROM users WHERE 'admin' = ANY(roles)"
      );
      expect(adminUsers.length).toBeGreaterThan(0);
    });

    it('should create users with initial balance', async () => {
      const users = await dataSource.query('SELECT * FROM users');
      users.forEach((user: any) => {
        expect(user.balance).toBeDefined();
        expect(parseFloat(user.balance)).toBeGreaterThan(0);
      });
    });

    it('should create events with open status', async () => {
      const openEvents = await dataSource.query(
        "SELECT * FROM events WHERE status = 'open'"
      );
      expect(openEvents.length).toBeGreaterThan(0);
    });

    it('should create event options with valid odds', async () => {
      const options = await dataSource.query('SELECT * FROM event_options');
      options.forEach((option: any) => {
        expect(option.odds).toBeDefined();
        expect(parseFloat(option.odds)).toBeGreaterThan(0);
      });
    });

    it('should create bets with pending status', async () => {
      const pendingBets = await dataSource.query(
        "SELECT * FROM bets WHERE status = 'pending'"
      );
      expect(pendingBets.length).toBeGreaterThan(0);
    });

    it('should link bets to valid users', async () => {
      const bets = await dataSource.query('SELECT * FROM bets');
      const users = await dataSource.query('SELECT id FROM users');
      const userIds = users.map((u: any) => u.id);

      bets.forEach((bet: any) => {
        expect(userIds).toContain(bet.userId);
      });
    });

    it('should link bets to valid events', async () => {
      const bets = await dataSource.query('SELECT * FROM bets');
      const events = await dataSource.query('SELECT id FROM events');
      const eventIds = events.map((e: any) => e.id);

      bets.forEach((bet: any) => {
        expect(eventIds).toContain(bet.eventId);
      });
    });
  });
});

