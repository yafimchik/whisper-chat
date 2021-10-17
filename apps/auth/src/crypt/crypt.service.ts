import { Inject, Injectable } from '@nestjs/common';
import { CRYPT_MODULE_OPTIONS } from './crypt.constants';
import { ICryptOptions } from './crypt.interface';
import { compare, hash } from 'bcrypt';

@Injectable()
export default class CryptService {
  constructor(@Inject(CRYPT_MODULE_OPTIONS) private readonly options: ICryptOptions) {}

  getHash(secret): Promise<string> {
    return hash(secret, this.options.saltOrRounds);
  }

  compare(secret, hash): Promise<boolean> {
    return compare(secret, hash);
  }
}
