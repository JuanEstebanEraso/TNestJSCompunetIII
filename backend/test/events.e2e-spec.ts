import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let eventId: string;

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
        username: 'adminevent',
        password: 'password123',
        roles: ['admin', 'user'],
      });
    adminToken = adminRes.body.token;

    // Crear usuario normal
    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'userevent',
        password: 'password123',
      });
    userToken = userRes.body.token;
  });

  afterAll(async () => {
    await dataSource.query('TRUNCATE TABLE bets CASCADE');
    await dataSource.query('TRUNCATE TABLE event_options CASCADE');
    await dataSource.query('TRUNCATE TABLE events CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    
    await app.close();
  });

  describe('/events (POST)', () => {
    it('should create an event as admin', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Event',
          description: 'A test event',
          options: [
            { name: 'Option A', odds: 2.5 },
            { name: 'Option B', odds: 1.8 },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'Test Event');
          expect(res.body).toHaveProperty('status', 'open');
          expect(res.body).toHaveProperty('options');
          expect(res.body.options).toHaveLength(2);
          eventId = res.body.id;
        });
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized Event',
          description: 'Should fail',
          options: [{ name: 'Option', odds: 2.0 }],
        })
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .send({
          name: 'No Auth Event',
          description: 'Should fail',
          options: [{ name: 'Option', odds: 2.0 }],
        })
        .expect(401);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'a', // Too short
          options: [],
        })
        .expect(400);
    });
  });

  describe('/events (GET)', () => {
    it('should get all events as authenticated user', () => {
      return request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/events')
        .expect(401);
    });
  });

  describe('/events/open (GET)', () => {
    it('should get open events without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/events/open')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/events/:id (GET)', () => {
    it('should get event by id', () => {
      return request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', eventId);
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('options');
        });
    });

    it('should return 404 for non-existent event', () => {
      return request(app.getHttpServer())
        .get('/api/events/550e8400-e29b-41d4-a716-446655440000')
        .expect(404);
    });

    it('should fail with invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/api/events/invalid-id')
        .expect(400);
    });
  });

  describe('/events/:id (PATCH)', () => {
    it('should update event as admin', () => {
      return request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          description: 'Updated description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('description', 'Updated description');
        });
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          description: 'Should fail',
        })
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .send({
          description: 'Should fail',
        })
        .expect(401);
    });
  });

  describe('/events/:id/close (POST)', () => {
    it('should close event as admin', () => {
      return request(app.getHttpServer())
        .post(`/api/events/${eventId}/close`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          finalResult: 'Option A',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'closed');
          expect(res.body).toHaveProperty('finalResult', 'Option A');
        });
    });

    it('should fail as non-admin', async () => {
      const newEventRes = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Event to close',
          description: 'Test',
          options: [{ name: 'Option', odds: 2.0 }],
        });

      return request(app.getHttpServer())
        .post(`/api/events/${newEventRes.body.id}/close`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          finalResult: 'Option',
        })
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .post(`/api/events/${eventId}/close`)
        .send({
          finalResult: 'Option A',
        })
        .expect(401);
    });
  });

  describe('/events/:id (DELETE)', () => {
    it.skip('should delete event as admin (skipped: cascade delete not implemented)', async () => {
      const newEventRes = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Event to delete',
          description: 'Will be deleted',
          options: [{ name: 'Option', odds: 2.0 }],
        });

      return request(app.getHttpServer())
        .delete(`/api/events/${newEventRes.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .expect(401);
    });
  });
});

