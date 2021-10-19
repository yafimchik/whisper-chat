import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import CryptService from './crypt.service';
import { ICryptModuleOptions } from './crypt.interface';
import { CRYPT_MODULE_OPTIONS } from './crypt.constants';

@Global()
@Module({})
export default class CryptModule {
  static forRootAsync(options: ICryptModuleOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    return {
      module: CryptModule,
      imports: options.imports,
      providers: [CryptService, asyncOptionsProvider],
      exports: [CryptService],
    };
  }

  private static createAsyncOptionsProvider(options: ICryptModuleOptions): Provider {
    return {
      provide: CRYPT_MODULE_OPTIONS,
      async useFactory(...args: any[]) {
        return options.useFactory(...args);
      },
      inject: options.inject || []
    };
  }
}
