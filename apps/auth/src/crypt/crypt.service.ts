import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import CRYPT_MODULE_OPTIONS from './crypt.constants';
import { ICryptOptions } from './crypt.interface';

@Injectable()
export default class CryptService {
  constructor(@Inject(CRYPT_MODULE_OPTIONS) private readonly options: ICryptOptions) {}

  getHash(secret: string): Promise<string> {
    return bcrypt.hash(secret, this.options.saltOrRounds);
  }

  compare(secret: string, hash: string): Promise<boolean> {
    return bcrypt.compare(secret, hash);
  }
}
