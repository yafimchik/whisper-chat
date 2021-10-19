import { ConfigService } from '@nestjs/config';
import {
  MONGODB_AUTH_DATABASE,
  MONGODB_AUTH_HOST,
  MONGODB_AUTH_PASSWORD,
  MONGODB_AUTH_PORT,
  MONGODB_AUTH_QUERY_PARAMS,
  MONGODB_AUTH_USERNAME,
} from './auth.constants';
import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { encodeUrl } from '../utils/utils';

const authMongodbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

function getAuthMongodbConnectionString(configService: ConfigService): string {
  const host = configService.get(MONGODB_AUTH_HOST);
  let port = configService.get(MONGODB_AUTH_PORT);
  port = port ? ':' + port : '';
  const user = configService.get(MONGODB_AUTH_USERNAME);
  const password = configService.get(MONGODB_AUTH_PASSWORD);
  const db = configService.get(MONGODB_AUTH_DATABASE);
  let query = configService.get(MONGODB_AUTH_QUERY_PARAMS);
  query = query ? '?' + query : '';
  const protocol = port ? 'mongodb' : 'mongodb+srv';
  const url = `${protocol}://${user}:${password}@${host}${port}/${db}${query}`;
  return encodeUrl(url);
}

export default function getAuthMongodbConfig(configService: ConfigService): TypegooseModuleOptions {
  return {
    uri: getAuthMongodbConnectionString(configService),
    ...authMongodbOptions,
  };
}

