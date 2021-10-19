import { ConfigService } from '@nestjs/config';
import {
  MONGODB_AUTH_DATABASE,
  MONGODB_AUTH_HOST,
  MONGODB_AUTH_PASSWORD,
  MONGODB_AUTH_PORT,
  MONGODB_AUTH_USERNAME,
} from './auth.constants';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

const authMongodbOptions = {
  userNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

function getAuthMongodbConnectionString(configService: ConfigService): string {
  const host = configService.get(MONGODB_AUTH_HOST);
  const username = configService.get(MONGODB_AUTH_USERNAME);
  const port = configService.get(MONGODB_AUTH_PORT);
  const password = configService.get(MONGODB_AUTH_PASSWORD);
  const database = configService.get(MONGODB_AUTH_DATABASE);

  return `mongodb://${username}:${password}@${host}:${port}/${database}`;
}

export default function getAuthMongodbConfig(configService: ConfigService): TypegooseModuleOptions {
  return {
    uri: getAuthMongodbConnectionString(configService),
    ...authMongodbOptions,
  };
}

