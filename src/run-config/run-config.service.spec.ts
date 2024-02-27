import { Test, TestingModule } from '@nestjs/testing';
import { RunConfigService } from './run-config.service';

describe('RunConfigService', () => {
  let service: RunConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunConfigService],
    }).compile();

    service = module.get<RunConfigService>(RunConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
