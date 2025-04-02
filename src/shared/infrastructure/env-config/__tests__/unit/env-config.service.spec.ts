import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config.service';
import { ConfigService } from '@nestjs/config';

describe('EnvConfigService', () => {
  let service: EnvConfigService;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EnvConfigService>(EnvConfigService);
    configService = module.get<ConfigService>(ConfigService) as jest.Mocked<ConfigService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppPort', () => {
    it('should return the port as a number', () => {
      configService.get.mockReturnValue('3000');
      const port = service.getAppPort();
      expect(port).toBe(3000);
      expect(configService.get).toHaveBeenCalledWith('PORT');
    });

    it('should throw an error if the port is not defined', () => {
      configService.get.mockReturnValue(undefined);
      expect(() => service.getAppPort()).toThrow('Invalid PORT value: undefined. Must be a number between 1 and 65535.');
    });

    it('should throw an error if the port is not a number', () => {
      configService.get.mockReturnValue('not-a-number');
      expect(() => service.getAppPort()).toThrow('Invalid PORT value: not-a-number. Must be a number between 1 and 65535.');
    });

    it('should throw an error if the port is less than 1', () => {
      configService.get.mockReturnValue('0');
      expect(() => service.getAppPort()).toThrow('Invalid PORT value: 0. Must be a number between 1 and 65535.');
    });

    it('should throw an error if the port is greater than 65535', () => {
      configService.get.mockReturnValue('70000');
      expect(() => service.getAppPort()).toThrow('Invalid PORT value: 70000. Must be a number between 1 and 65535.');
    });
  });

  describe('getNodeEnv', () => {
    it('should return the NODE_ENV as a string', () => {
      configService.get.mockReturnValue('development');
      const nodeEnv = service.getNodeEnv();
      expect(nodeEnv).toBe('development');
      expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    });

    it('should throw an error if NODE_ENV is not defined', () => {
      configService.get.mockReturnValue(undefined);
      expect(() => service.getNodeEnv()).toThrow('Invalid NODE_ENV value: undefined. Must be one of: development, production, test.');
    });

    it('should throw an error if NODE_ENV is invalid', () => {
      configService.get.mockReturnValue('invalid-env');
      expect(() => service.getNodeEnv()).toThrow('Invalid NODE_ENV value: invalid-env. Must be one of: development, production, test.');
    });
  });
});