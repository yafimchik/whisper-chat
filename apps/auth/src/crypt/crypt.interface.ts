import { ModuleMetadata } from '@nestjs/common/interfaces';

export interface ICryptOptions {
  saltOrRounds: number | string;
}

export interface ICryptModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory(...args: any[]): Promise<ICryptOptions> | ICryptOptions;
  inject?: any[];
}
