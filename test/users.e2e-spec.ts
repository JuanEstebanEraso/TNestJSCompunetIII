import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminToken: string;
  let userToken: string;
  let userId: string;

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
        username: 'adminuser',
        password: 'password123',
        roles: ['admin', 'user'],
      });
    adminToken = adminRes.body.token;

    // Crear usuario normal
    const userRes = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: 'normaluser',
        password: 'password123',
      });
    userToken = userRes.body.token;
    userId = userRes.body.id;
  });

  afterAll(async () => {
    await dataSource.query('TRUNCATE TABLE bets CASCADE');
    await dataSource.query('TRUNCATE TABLE event_options CASCADE');
    await dataSource.query('TRUNCATE TABLE events CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');
    
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a new user', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'newuser',
          password: 'password123',
          balance: 5000,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('username', 'newuser');
          expect(res.body).toHaveProperty('balance');
        });
    });

    it('should fail with duplicate username', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'normaluser',
          password: 'password123',
        })
        .expect(409);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'ab',
          password: '123',
        })
        .expect(400);
    });
  });

  describe('/users (GET)', () => {
    it('should get all users as admin', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should fail without token', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .expect(401);
    });

    it('should fail with user role (not admin)', () => {
      return request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get user by id as authenticated user', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('username');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}`)
        .expect(401);
    });

    it('should fail with invalid UUID', () => {
      return request(app.getHttpServer())
        .get('/api/users/invalid-uuid')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe('/users/:id/balance (GET)', () => {
    it('should get user balance', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}/balance`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('balance');
          expect(typeof res.body.balance).toBe('number');
          expect(res.body.balance).toBeGreaterThanOrEqual(0);
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .get(`/api/users/${userId}/balance`)
        .expect(401);
    });
  });

  describe('/users/username/:username (GET)', () => {
    it('should find user by username as admin', () => {
      return request(app.getHttpServer())
        .get('/api/users/username/normaluser')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('username', 'normaluser');
        });
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .get('/api/users/username/normaluser')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .get('/api/users/username/nonexistent')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('/users/:id (PATCH)', () => {
    it('should update user', () => {
      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          balance: 15000,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('balance');
        });
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .patch(`/api/users/${userId}`)
        .send({ balance: 20000 })
        .expect(401);
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete user as admin', async () => {
      const newUserRes = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tobedeleted',
          password: 'password123',
        });

      return request(app.getHttpServer())
        .delete(`/api/users/${newUserRes.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('should fail as non-admin', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authentication', () => {
      return request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .expect(401);
    });
  });
});

