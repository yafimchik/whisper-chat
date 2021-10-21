import { Test, TestingModule } from '@nestjs/testing';
import CryptService from './crypt.service';
import { CRYPT_MODULE_OPTIONS } from './crypt.constants';
import { Provider } from '@nestjs/common';

describe('CryptService', () => {
  let service: CryptService;

  beforeEach(async () => {
    const optionsProvider: Provider = {
      provide: CRYPT_MODULE_OPTIONS,
      useValue: {
        saltOrRounds: 10,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptService, optionsProvider],
    }).compile();

    service = module.get<CryptService>(CryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create hash and compare - success', async () => {
    const password = 'asdglasdv;lkjwe2134t';

    const hash = await service.getHash(password);
    const compareResult = await service.compare(password, hash);

    expect(compareResult).toBeTruthy();
  });

  it('create hash and compare with wrong password - fail', async () => {
    const password = 'asdglasdv;lkjwe2134t';
    const password2 = 'jhklasfdghjklafddfgg4';

    const hash = await service.getHash(password);
    const compareResult = await service.compare(password2, hash);

    expect(compareResult).toBeFalsy();
  });
});
