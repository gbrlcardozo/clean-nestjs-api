import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private readonly configService: ConfigService) {}

  getAppPort(): number {
    const port = this.configService.get<string>('PORT');
    const portNumber = Number(port);

    if (!port || isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      throw new Error(`Invalid PORT value: ${port}. Must be a number between 1 and 65535.`);
    }

    return portNumber;
  }

  getNodeEnv(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const allowedEnvs = ['development', 'production', 'test'] as const;

    if (!nodeEnv || !allowedEnvs.includes(nodeEnv as typeof allowedEnvs[number])) {
      throw new Error(
        `Invalid NODE_ENV value: ${nodeEnv}. Must be one of: ${allowedEnvs.join(', ')}.`,
      );
    }

    return nodeEnv;
  }
}