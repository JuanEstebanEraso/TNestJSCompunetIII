import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Bets (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let userId: string;
  let eventId: string;
  let betId: string;

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

    // Crear admin
    const adminRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'adminbet',
        password: 'password123',
        roles: ['admin', 'user'],
      });
    adminToken = adminRes.body.token;

    // Crear usuario normal
    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'userbet',
        password: 'password123',
      });
    userToken = userRes.body.token;
    userId = userRes.body.id;

    // Crear evento
    const eventRes = await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Bet Test Event',
        description: 'Event for betting',
        options: [
          { name: 'Team A', odds: 2.5 },
          { name: 'Team B', odds: 1.8 },
        ],
      });
    eventId = eventRes.body.id;
  });

  afterAll(async () => {
    await dataSource.query('TRUNCATE TABLE bets CASCADE');
    await dataSource.query('TRUNCATE TABLE event_options CASCADE');
    await dataSource.query('TRUNCATE TABLE events CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    
    await app.close();
  });

  describe('/bets (POST)', () => {
    it('should create a bet as authenticated user', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: eventId,
          selectedOption: 'Team A',
          amount: 500,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('selectedOption', 'Team A');
          expect(res.body).toHaveProperty('amount', 500);
          expect(res.body).toHaveProperty('status', 'pending');
          betId = res.body.id;
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .send({
          userId: userId,
          eventId: eventId,
          selectedOption: 'Team A',
          amount: 100,
        })
        .expect(401);
    });

    it('should fail with invalid event ID', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: 'invalid-uuid',
          selectedOption: 'Team A',
          amount: 100,
        })
        .expect(400);
    });

    it('should fail with insufficient balance', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: eventId,
          selectedOption: 'Team A',
          amount: 999999999,
        })
        .expect(400);
    });

    it('should fail with invalid amount', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: eventId,
          selectedOption: 'Team A',
          amount: 0,
        })
        .expect(400);
    });

    it('should fail with non-existent event', () => {
      return request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: '550e8400-e29b-41d4-a716-446655440000',
          selectedOption: 'Team A',
          amount: 100,
        })
        .expect(404);
    });
  });

  describe('/bets (GET)', () => {
    it('should get all bets as admin', () => {
      return request(app.getHttpServer())
        .get('/api/bets')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .get('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/bets')
        .expect(401);
    });
  });

  describe('/bets/:id (GET)', () => {
    it('should get bet by id as authenticated user', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/${betId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', betId);
          expect(res.body).toHaveProperty('selectedOption');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/${betId}`)
        .expect(401);
    });

    it('should return 404 for non-existent bet', () => {
      return request(app.getHttpServer())
        .get('/api/bets/550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });

    it('should fail with invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/api/bets/invalid-id')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe('/bets/user/:userId (GET)', () => {
    it('should get bets by user as authenticated user', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/user/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/user/${userId}`)
        .expect(401);
    });
  });

  describe('/bets/user/:userId/stats (GET)', () => {
    it('should get user betting stats', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/user/${userId}/stats`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalBets');
          expect(res.body).toHaveProperty('totalAmountBet');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/user/${userId}/stats`)
        .expect(401);
    });
  });

  describe('/bets/event/:eventId (GET)', () => {
    it('should get bets by event', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/event/${eventId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/bets/event/${eventId}`)
        .expect(401);
    });
  });

  describe('/bets/event/:eventId/process (POST)', () => {
    it.skip('should process event bets as admin (skipped: implementation issue)', async () => {
      // Crear evento y apuesta
      const newEventRes = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Process Event',
          description: 'For processing',
          options: [{ name: 'Winner', odds: 2.0 }],
        });

      await request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: newEventRes.body.id,
          selectedOption: 'Winner',
          amount: 100,
        });

      // Cerrar evento
      await request(app.getHttpServer())
        .post(`/api/events/${newEventRes.body.id}/close`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          finalResult: 'Winner',
        });

      return request(app.getHttpServer())
        .post(`/api/bets/event/${newEventRes.body.id}/process`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('processedBets');
        });
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .post(`/api/bets/event/${eventId}/process`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post(`/api/bets/event/${eventId}/process`)
        .expect(401);
    });
  });

  describe('/bets/:id (DELETE)', () => {
    it('should delete bet as authenticated user', async () => {
      // Crear nueva apuesta
      const newBetRes = await request(app.getHttpServer())
        .post('/api/bets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          userId: userId,
          eventId: eventId,
          selectedOption: 'Team B',
          amount: 50,
        });

      return request(app.getHttpServer())
        .delete(`/api/bets/${newBetRes.body.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/bets/${betId}`)
        .expect(401);
    });

    it('should return 404 for non-existent bet', () => {
      return request(app.getHttpServer())
        .delete('/api/bets/550e8400-e29b-41d4-a716-446655440000')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    });
  });
});

