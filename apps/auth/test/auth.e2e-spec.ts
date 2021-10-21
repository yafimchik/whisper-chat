import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import AuthModule from '../src/Auth.module';
import RegisterUserDto from '../src/dto/user-register.dto';
import { Response } from 'supertest';
import { USER_NOT_UNIQUE_ERROR } from '../src/user/user.errors';
import { disconnect } from 'mongoose';
import { BAD_CREDENTIALS_ERROR, USER_NOT_ACTIVATED_ERROR } from '../src/auth.errors';

const userDto: RegisterUserDto = {
  email: 'auth@test.ru',
  password: 'asdjklxcjklasd;lsads',
};

const wrongUserDto: RegisterUserDto = { ...userDto };
wrongUserDto.password += 'asd';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let activationLink: string;
  let jwt: string;
  let jwtRefresh: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(disconnect);

  it('/register (POST) - SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send(userDto)
      .expect(201)
      .then(({ body }: Response) => {
        userId = body._id;
        expect(userId).toBeDefined();
      });
  });

  it('/register (POST) : the same user - FAIL', () => {
    return request(app.getHttpServer())
      .post('/register')
      .send(userDto)
      .expect(400)
      .then(({ body }: Response) => {
        expect(body.message).toBe(USER_NOT_UNIQUE_ERROR);
      });
  });

  it('/login (POST) : not activated user - FAIL', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send(userDto)
      .expect(403)
      .then(({ body }: Response) => {
        expect(body.message).toBe(USER_NOT_ACTIVATED_ERROR);
      });
  });

  it('/activation/send-email (POST) - SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/activation/send-email')
      .send(userDto)
      .expect(201)
      .then(({ body }: Response) => {
        activationLink = body.link;
        expect(activationLink).toBeDefined();
      });
  });

  it('/activation/send-email (POST) : with wrong credentials - FAIL', () => {
    return request(app.getHttpServer())
      .post('/activation/send-email')
      .send(wrongUserDto)
      .expect(401)
      .then(({ body }: Response) => {
        expect(body.message).toBe(BAD_CREDENTIALS_ERROR);
      });
  });

  it('activation/by-user/:userId/code/:activationCode (POST) : with wrong activation code - FAIL', () => {
    return request(app.getHttpServer())
      .get(activationLink + 'jhks')
      .expect(200)
      .then(({ body }: Response) => {
        expect(body.isActivated).toBeFalsy();
      });
  });

  it('activation/by-user/:userId/code/:activationCode (POST) - SUCCESS', () => {
    return request(app.getHttpServer())
      .get(activationLink)
      .expect(200)
      .then(({ body }: Response) => {
        expect(body.isActivated).toBeTruthy();
      });
  });

  it('activation/by-user/:userId/code/:activationCode (POST) : already activated user - SUCCESS', () => {
    return request(app.getHttpServer())
      .get(activationLink)
      .expect(200)
      .then(({ body }: Response) => {
        expect(body.isActivated).toBeTruthy();
      });
  });

  it('/activation/send-email (POST) : after successful activation - FAIL', () => {
    return request(app.getHttpServer())
      .post('/activation/send-email')
      .send(userDto)
      .expect(201)
      .then(({ body }: Response) => {
        expect(body.link).toBeFalsy();
      });
  });

  it('/login (POST) : with wrong credentials - FAIL', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send(wrongUserDto)
      .expect(401)
      .then(({ body }: Response) => {
        expect(body.message).toBe(BAD_CREDENTIALS_ERROR);
      });
  });

  it('/login (POST) - SUCCESS', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send(userDto)
      .expect(201)
      .then(({ body }: Response) => {
        expect(body.access_token).toBeDefined();
        expect(body.refresh_token).toBeDefined();
        expect(body.expires_after).toBeDefined();
        expect(body.refresh_before).toBeDefined();
        jwt = body.access_token;
        jwtRefresh = body.refresh_token;
      });
  });

  it('/user/delete (POST with JWT) - success', () => {
    return request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .then(({ body }: Response) => {
        expect(body).toBeDefined();
      });
  });
});
