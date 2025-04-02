import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';

@Module({})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
          ...options,
        }),
      ],
    };
  }
}