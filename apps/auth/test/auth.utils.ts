import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Promise } from 'mongoose';
import AuthModule from '../src/auth.module';

export default async function startApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AuthModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
