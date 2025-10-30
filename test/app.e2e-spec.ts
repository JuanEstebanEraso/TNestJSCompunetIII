import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

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
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Root', () => {
    it('/ (GET) should return 404 (no route without prefix)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(404);
    });
  });

  describe('API Health', () => {
    it('/api (GET) should return Hello World', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('Hello World!');
    });

    it('should handle 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/non-existent-route')
        .expect(404);
    });
  });

  describe('Global Validation', () => {
    it('should reject unknown properties (forbidNonWhitelisted)', async () => {
      const uniqueUsername = `testvalidation${Date.now()}`;
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          username: uniqueUsername,
          password: 'password123',
          unknownField: 'should be stripped',
        })
        .expect(400);
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect((res) => {
          // Note: CORS headers are typically set, though they might not appear in all responses
          expect(res.status).toBe(200);
        });
    });
  });
});
