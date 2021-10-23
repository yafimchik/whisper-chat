import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { disconnect } from 'mongoose';
import RegisterUserDto from '../src/dto/user-register.dto';
import { TOKEN_EXPIRED_ERROR, USER_NOT_ACTIVATED_ERROR } from '../src/auth.errors';
import { asyncPause } from '../src/utils/utils';
import startApp from './auth.utils';

const userDto: RegisterUserDto = {
  email: 'user-guard@test.ru',
  password: '_________old',
};

const updateDto: RegisterUserDto = { ...userDto };
updateDto.password = '_________new';

describe('Auth. Test Guards (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let jwt: string;
  let refresh: string;
  let activationLink: string;

  beforeEach(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .then();
    await disconnect();
  });

  beforeAll(async () => {
    app = await startApp();

    await request(app.getHttpServer())
      .post('/register')
      .send(userDto)
      .then(({ body }: Response) => {
        userId = body._id;
      });
    await request(app.getHttpServer())
      .post('/activation/send-email')
      .send(userDto)
      .then(({ body }: Response) => {
        activationLink = body.link;
      });
  });

  describe('Before activation', () => {
    it('1: /login (POST) : not activated - FAIL', () => {
      return request(app.getHttpServer())
        .post(`/login`)
        .send(userDto)
        .expect(403)
        .then(({ body }: Response) => {
          expect(body.message).toBe(USER_NOT_ACTIVATED_ERROR);
        });
    });

    it('2: /activation (GET) - SUCCESS', async () => {
      await request(app.getHttpServer()).get(activationLink).expect(200).then();
      return asyncPause(1000);
    });
  });

  describe('Login', () => {
    it('3: /login (POST) : after activation - SUCCESS', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send(userDto)
        .expect(201)
        .then(({ body }: Response) => {
          jwt = body.access_token;
          refresh = body.refresh_token;
        });
    });
  });

  describe('After login', () => {
    it('4: /user/:id (DELETE with refresh JWT) - FAIL', () => {
      return request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .set('Authorization', `Bearer ${refresh}`)
        .expect(403)
        .then();
    });

    it('5: /user/:id (UPDATE with JWT) - SUCCESS', async () => {
      await request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send(updateDto)
        .expect(200)
        .then();
      return asyncPause(1000);
    });
  });

  describe('After user update', () => {
    it('6: /user/:id (GET with JWT) : after user update - FAIL', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(403)
        .then(({ body }: Response) => {
          expect(body.message).toBe(TOKEN_EXPIRED_ERROR);
        });
    });

    it('7: /refresh-tokens (GET) : after user update - FAIL', () => {
      return request(app.getHttpServer())
        .get('/refresh-tokens')
        .set('Authorization', `Bearer ${refresh}`)
        .expect(403)
        .then();
    });

    it('8: /login (POST) : after user update with old password - FAIL', () => {
      return request(app.getHttpServer()).post('/login').send(userDto).expect(401).then();
    });

    it('9: /login (POST) : after user update - SUCCESS', async () => {
      await request(app.getHttpServer())
        .post('/login')
        .send(updateDto)
        .expect(201)
        .then(({ body }: Response) => {
          jwt = body.access_token;
          refresh = body.refresh_token;
        });
      return asyncPause(1000);
    });
  });

  describe('Check guard types crossing', () => {
    it('10: /login (POST with JWT) : without credentials - FAIL', () => {
      return request(app.getHttpServer())
        .post('/login')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(401)
        .then();
    });

    it('11: /user/:id (PATCH with credentials) : without JWT - FAIL', async () => {
      return request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .send(updateDto)
        .expect(401)
        .then();
    });
  });
});
