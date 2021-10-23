import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { disconnect } from 'mongoose';
import AuthModule from '../src/Auth.module';
import RegisterUserDto from '../src/dto/user-register.dto';
import { ISecuredUser } from '../src/user/user.interface';
import UpdateUserDto from '../src/user/dto/update-user.dto';
import { USER_NOT_FOUND_ERROR, USER_NOT_UNIQUE_ERROR } from '../src/user/user.errors';
import { asyncPause } from '../src/utils/utils';
import startApp from './auth.utils';

const userDto: RegisterUserDto = {
  email: 'user@test.ru',
  password: 'asdjklxcjklasd;lsads',
};

function getNewUserDto(number = 0): RegisterUserDto {
  const newUser = { ...userDto };
  newUser.email = `${number.toString()}_${newUser.email}`;
  newUser.password = number.toString() + newUser.password;
  return newUser;
}

const newUsersCount = 10;

const wrongUserDto: RegisterUserDto = { ...userDto };
wrongUserDto.password += 'asd';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let jwt: string;

  const newUsers: ISecuredUser[] = [];

  beforeEach(async () => {
    app = await startApp();
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)
      .then();
    return disconnect();
  });

  beforeAll(async () => {
    let activationLink: string;
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
    await request(app.getHttpServer()).get(activationLink);
    await asyncPause(1000);
    return request(app.getHttpServer())
      .post('/login')
      .send(userDto)
      .then(({ body }: Response) => {
        jwt = body.access_token;
      });
  });

  describe('Creation of new users', () => {
    it(`/user (POST) : create ${newUsersCount} new users - SUCCESS`, async () => {
      const tasks: Promise<void>[] = [];
      for (let i = 0; i < newUsersCount; i += 1) {
        const newUser = getNewUserDto(i);
        tasks.push(
          request(app.getHttpServer())
            .post('/user')
            .set('Authorization', `Bearer ${jwt}`)
            .send(getNewUserDto(i))
            .expect(201)
            .then(({ body }: Response) => {
              expect(body._id).toBeDefined();
              expect(body.email).toBe(newUser.email);
              newUsers.push(body);
            }),
        );
      }
      return Promise.all(tasks);
    });
  });

  describe(`After new user's creation`, () => {
    it('/user (POST) : create user with existing email - FAIL', () => {
      return request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${jwt}`)
        .send(getNewUserDto())
        .expect(400)
        .then(({ body }: Response) => {
          expect(body.message).toBe(USER_NOT_UNIQUE_ERROR);
        });
    });

    it('/user/:id (UPDATE with JWT) - SUCCESS', () => {
      const user = newUsers[0];
      const update: UpdateUserDto = {
        isActivated: true,
        email: `updated_${user.email}`,
      };
      return request(app.getHttpServer())
        .patch(`/user/${user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send(update)
        .expect(200)
        .then(({ body }: Response) => {
          expect(body._id).toBe(user._id);
          expect(body.email).toBe(update.email);
          expect(body.isActivated).toBe(update.isActivated);
        });
    });

    it('/user/:id (GET with JWT) - SUCCESS', () => {
      const user = newUsers[1];

      return request(app.getHttpServer())
        .get(`/user/${user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .then(({ body }: Response) => {
          expect(body._id).toBe(user._id);
          expect(body.email).toBe(user.email);
        });
    });

    it('/user/by-email/:email (GET with JWT) - SUCCESS', () => {
      const user = newUsers[1];

      return request(app.getHttpServer())
        .get(`/user/by-email/${user.email}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .then(({ body }: Response) => {
          expect(body._id).toBe(user._id);
          expect(body.email).toBe(user.email);
        });
    });

    it('/user (GET with JWT) - SUCCESS', () => {
      return request(app.getHttpServer())
        .get(`/user`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200)
        .then(({ body }: Response) => {
          expect(body.length).toBeGreaterThan(0);
          body.forEach((user: ISecuredUser) => {
            expect(user._id).toBeDefined();
            expect(user.email).toBeDefined();
          });
        });
    });

    it('/user/:id (DELETE with JWT) - SUCCESS', async () => {
      const deleteTasks: Promise<void>[] = [];
      for (let i = 0; i < newUsers.length; i += 1) {
        const id = newUsers[i]._id;
        deleteTasks.push(
          request(app.getHttpServer())
            .delete(`/user/${id}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(200)
            .then(),
        );
      }
      return deleteTasks;
    });
  });

  describe('After deleting new users', () => {
    it('/user/:id (DELETE with JWT) - FAIL', () => {
      const user = newUsers[0];
      return request(app.getHttpServer())
        .delete(`/user/${user._id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .expect(404)
        .then(({ body }: Response) => {
          expect(body.message).toBe(USER_NOT_FOUND_ERROR);
        });
    });
  });
});
