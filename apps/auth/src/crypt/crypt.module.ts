import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import CryptService from './crypt.service';
import { ICryptModuleOptions, ICryptOptions } from './crypt.interface';
import { CRYPT_MODULE_OPTIONS } from './crypt.constants';

@Global()
@Module({})
export default class CryptModule {
  static forRoot(options: ICryptOptions): DynamicModule {
    const optionsProvider = this.createOptionsProvider(options);
    return {
      module: CryptModule,
      providers: [CryptService, optionsProvider],
      exports: [CryptService],
    };
  }

  static forRootAsync(options: ICryptModuleOptions): DynamicModule {
    const asyncOptionsProvider = this.createAsyncOptionsProvider(options);
    return {
      module: CryptModule,
      imports: options.imports,
      providers: [CryptService, asyncOptionsProvider],
      exports: [CryptService],
    };
  }

  private static createOptionsProvider(options: ICryptOptions): Provider {
    return {
      provide: CRYPT_MODULE_OPTIONS,
      useValue: options,
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
