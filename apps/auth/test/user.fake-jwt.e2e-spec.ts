import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import AuthModule from '../src/Auth.module';
import RegisterUserDto from '../src/dto/user-register.dto';
import { disconnect, Types } from 'mongoose';

const userId = new Types.ObjectId().toHexString();

const userDto: RegisterUserDto = {
  email: 'user-no-jwt@test.ru',
  password: 'asdjklxcjklasd;lsads',
};

const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('UserController. Fake JWT (e2e)', () => {
  let app: INestApplication;

  async function startApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }

  beforeEach(startApp);
  afterAll(disconnect);

  describe('Without JWT', () => {
    it('/user (POST) - FAIL', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send(userDto)
        .expect(401)
        .then();
    });

    it('/user/:id (UPDATE) - FAIL', () => {
      return request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .send(userDto)
        .expect(401)
        .then();
    });

    it('/user/:id (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(401)
        .then();
    });

    it('/user/by-email/:email (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user/by-email/${userDto.email}`)
        .expect(401)
        .then();
    });

    it('/user (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user`)
        .expect(401)
        .then();
    });

    it('/user/:id (DELETE) - FAIL', async () => {
      return request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .expect(401)
        .then();
    });
  });

  describe('With fake JWT', () => {
    it('/user (POST) - FAIL', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${fakeJwt}`)
        .send(userDto)
        .expect(401)
        .then();
    });

    it('/user/:id (UPDATE) - FAIL', () => {
      return request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${fakeJwt}`)
        .send(userDto)
        .expect(401)
        .then();
    });

    it('/user/:id (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${fakeJwt}`)
        .expect(401)
        .then();
    });

    it('/user/by-email/:email (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user/by-email/${userDto.email}`)
        .set('Authorization', `Bearer ${fakeJwt}`)
        .expect(401)
        .then();
    });

    it('/user (GET) - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user`)
        .set('Authorization', `Bearer ${fakeJwt}`)
        .expect(401)
        .then();
    });

    it('/user/:id (DELETE) - FAIL', async () => {
      return request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .set('Authorization', `Bearer ${fakeJwt}`)
        .expect(401)
        .then();
    });
  });
});
